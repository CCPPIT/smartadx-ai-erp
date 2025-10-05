import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/jwt';
import { validateSession } from '@/lib/session';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
    sessionId?: string;
  };
}

/**
 * Middleware to verify JWT token and session
 */
export async function authMiddleware(request: NextRequest): Promise<NextResponse | null> {
  // Get token from Authorization header
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  // Get session ID from cookie
  const sessionId = request.cookies.get('sessionId')?.value;

  // Check if token exists
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'NO_TOKEN' },
      { status: 401 }
    );
  }

  // Verify token
  const payload = await verifyAccessToken(token);
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired token', code: 'INVALID_TOKEN' },
      { status: 401 }
    );
  }

  // Validate session if sessionId exists
  if (sessionId) {
    const sessionValidation = await validateSession(sessionId);
    if (!sessionValidation.valid) {
      return NextResponse.json(
        { error: 'Invalid session', code: 'INVALID_SESSION' },
        { status: 401 }
      );
    }
  }

  // Attach user info to request
  const response = NextResponse.next();
  response.headers.set('X-User-Id', payload.userId);
  response.headers.set('X-User-Email', payload.email);
  response.headers.set('X-User-Role', payload.role);

  return null; // Continue to the next middleware/handler
}

/**
 * Middleware to check if user has required role
 */
export function requireRole(...allowedRoles: string[]) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'NO_TOKEN' },
        { status: 401 }
      );
    }

    const payload = await verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    // Check if user has required role
    if (!allowedRoles.includes(payload.role)) {
      return NextResponse.json(
        { 
          error: 'Insufficient permissions', 
          code: 'FORBIDDEN',
          required: allowedRoles,
          current: payload.role
        },
        { status: 403 }
      );
    }

    return null; // Continue
  };
}

/**
 * Middleware to check if user has required permission
 */
export function requirePermission(permission: string) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'NO_TOKEN' },
        { status: 401 }
      );
    }

    const payload = await verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    // SUPER_ADMIN has all permissions
    if (payload.role === 'SUPER_ADMIN') {
      return null;
    }

    // TODO: Check user permissions from database
    // This is a placeholder - implement actual permission checking
    
    return null; // Continue
  };
}

/**
 * Rate limiting middleware
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const identifier = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';

    const now = Date.now();
    const userLimit = rateLimitMap.get(identifier);

    if (!userLimit || now > userLimit.resetTime) {
      rateLimitMap.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return null;
    }

    if (userLimit.count >= maxRequests) {
      return NextResponse.json(
        { 
          error: 'Too many requests', 
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil((userLimit.resetTime - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((userLimit.resetTime - now) / 1000)),
            'X-RateLimit-Limit': String(maxRequests),
            'X-RateLimit-Remaining': String(maxRequests - userLimit.count),
            'X-RateLimit-Reset': String(userLimit.resetTime),
          }
        }
      );
    }

    userLimit.count++;
    return null;
  };
}

/**
 * CORS middleware
 */
export function corsMiddleware(request: NextRequest): NextResponse {
  const origin = request.headers.get('origin');
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

  const response = NextResponse.next();

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}
