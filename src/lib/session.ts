import { prisma } from './prisma';
import { randomBytes } from 'crypto';

export interface Session {
  id: string;
  userId: string;
  authMethod: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
  createdAt: Date;
  lastAccessed: Date;
}

/**
 * Create a new session
 */
export async function createSession(
  userId: string,
  authMethod: string,
  options?: {
    ipAddress?: string;
    userAgent?: string;
    expiresIn?: number; // milliseconds
  }
): Promise<Session> {
  const sessionId = randomBytes(32).toString('hex');
  const expiresIn = options?.expiresIn || 7 * 24 * 60 * 60 * 1000; // 7 days default
  const expiresAt = new Date(Date.now() + expiresIn);

  const session = await prisma.userSession.create({
    data: {
      id: sessionId,
      userId,
      authMethod,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
      expiresAt,
      lastAccessed: new Date(),
    },
  });

  return session;
}

/**
 * Get session by ID
 */
export async function getSession(sessionId: string): Promise<Session | null> {
  const session = await prisma.userSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) return null;

  // Check if session is expired
  if (session.expiresAt < new Date()) {
    await deleteSession(sessionId);
    return null;
  }

  return session;
}

/**
 * Update session last accessed time
 */
export async function updateSessionAccess(sessionId: string): Promise<void> {
  await prisma.userSession.update({
    where: { id: sessionId },
    data: { lastAccessed: new Date() },
  });
}

/**
 * Delete session (logout)
 */
export async function deleteSession(sessionId: string): Promise<void> {
  await prisma.userSession.delete({
    where: { id: sessionId },
  }).catch(() => {
    // Session might already be deleted
  });
}

/**
 * Delete all sessions for a user
 */
export async function deleteAllUserSessions(userId: string): Promise<void> {
  await prisma.userSession.deleteMany({
    where: { userId },
  });
}

/**
 * Get all active sessions for a user
 */
export async function getUserSessions(userId: string): Promise<Session[]> {
  const sessions = await prisma.userSession.findMany({
    where: {
      userId,
      expiresAt: { gt: new Date() },
    },
    orderBy: { lastAccessed: 'desc' },
  });

  return sessions;
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await prisma.userSession.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });

  return result.count;
}

/**
 * Extend session expiration
 */
export async function extendSession(
  sessionId: string,
  additionalTime: number = 7 * 24 * 60 * 60 * 1000
): Promise<void> {
  const session = await getSession(sessionId);
  if (!session) return;

  const newExpiresAt = new Date(Date.now() + additionalTime);

  await prisma.userSession.update({
    where: { id: sessionId },
    data: { expiresAt: newExpiresAt },
  });
}

/**
 * Validate session and return user data
 */
export async function validateSession(sessionId: string): Promise<{
  valid: boolean;
  userId?: string;
  session?: Session;
}> {
  const session = await getSession(sessionId);

  if (!session) {
    return { valid: false };
  }

  // Update last accessed time
  await updateSessionAccess(sessionId);

  return {
    valid: true,
    userId: session.userId,
    session,
  };
}
