import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRefreshToken, generateAccessToken } from '@/lib/jwt';
import { validateSession, extendSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie or body
    const refreshToken = request.cookies.get('refreshToken')?.value ||
                        (await request.json()).refreshToken;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token required' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    // Validate session if sessionId exists
    if (payload.sessionId) {
      const sessionValidation = await validateSession(payload.sessionId);
      if (!sessionValidation.valid) {
        return NextResponse.json(
          { error: 'Invalid session' },
          { status: 401 }
        );
      }

      // Extend session
      await extendSession(payload.sessionId);
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's primary role
    const primaryRole = user.userRoles.find(ur => ur.role.name === 'SUPER_ADMIN') ||
                       user.userRoles[0];
    const role = primaryRole?.role.name || user.role;

    // Generate new access token
    const newAccessToken = await generateAccessToken({
      userId: user.id,
      email: user.email,
      role,
      sessionId: payload.sessionId,
    });

    return NextResponse.json({
      success: true,
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role,
      },
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
