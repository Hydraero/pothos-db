import { db } from '@/lib/db';
import { users, subscriptions } from '@/lib/db/schema';
import { and, eq, gt } from 'drizzle-orm';

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (user?.hasLifetimeAccess) return true;

  const sub = await db.query.subscriptions.findFirst({
    where: and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.status, 'ACTIVE'),
      gt(subscriptions.currentPeriodEnd, new Date())
    ),
  });
  return !!sub;
}

export async function hasRole(
  userId: string,
  role: 'USER' | 'MODERATOR' | 'ADMIN'
): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (!user) return false;
  if (role === 'USER') return true;
  if (role === 'MODERATOR') return ['MODERATOR', 'ADMIN'].includes(user.role);
  if (role === 'ADMIN') return user.role === 'ADMIN';
  return false;
}

export async function getUserWithSubscription(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      subscription: true,
    },
  });
  return user;
}