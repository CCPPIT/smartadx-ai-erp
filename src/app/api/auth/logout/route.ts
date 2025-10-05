import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/session';
import { verifyAccessToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    // Get session ID from cookie
    const sessionId = request.cookies.get('sessionId')?.value;
    
    // Get token from header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    // Verify token to get user info
    if (token) {
      const payload = await verifyAccessToken(token);
      if (payload) {
        console.log(`User ${payload.email} logged out`);
      }
    }

    // Delete session if exists
    if (sessionId) {
      await deleteSession(sessionId);
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear cookies
    response.cookies.delete('sessionId');
    response.cookies.delete('refreshToken');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
