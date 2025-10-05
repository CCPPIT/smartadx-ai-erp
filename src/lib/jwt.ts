import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-change-in-production'
);

const REFRESH_TOKEN_SECRET = new TextEncoder().encode(
  process.env.REFRESH_TOKEN_SECRET || 'default-refresh-secret-change-in-production'
);

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  sessionId?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generate access token (short-lived)
 */
export async function generateAccessToken(payload: JWTPayload): Promise<string> {
  const expiresIn = process.env.JWT_EXPIRES_IN || '15m';
  
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .setIssuer('smartadx-erp')
    .setAudience('smartadx-users')
    .sign(JWT_SECRET);
}

/**
 * Generate refresh token (long-lived)
 */
export async function generateRefreshToken(payload: JWTPayload): Promise<string> {
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
  
  return await new SignJWT({ userId: payload.userId, sessionId: payload.sessionId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .setIssuer('smartadx-erp')
    .setAudience('smartadx-users')
    .sign(REFRESH_TOKEN_SECRET);
}

/**
 * Generate both access and refresh tokens
 */
export async function generateTokenPair(payload: JWTPayload): Promise<TokenPair> {
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken(payload),
    generateRefreshToken(payload)
  ]);

  return { accessToken, refreshToken };
}

/**
 * Verify access token
 */
export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: 'smartadx-erp',
      audience: 'smartadx-users',
    });

    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error('Access token verification failed:', error);
    return null;
  }
}

/**
 * Verify refresh token
 */
export async function verifyRefreshToken(token: string): Promise<{ userId: string; sessionId?: string } | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_TOKEN_SECRET, {
      issuer: 'smartadx-erp',
      audience: 'smartadx-users',
    });

    return payload as { userId: string; sessionId?: string };
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
}

/**
 * Decode token without verification (for debugging)
 */
export function decodeToken(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf-8')
    );
    
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  return Date.now() >= decoded.exp * 1000;
}
