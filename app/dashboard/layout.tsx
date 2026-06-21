import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { DashboardNav } from '@/components/dashboard-nav';
import { Toaster } from '@/components/ui/sonner';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect('/login');
  }

  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, session.user.id),
  });

  const isPremium =
    session.user.hasLifetimeAccess ||
    (subscription?.status === 'ACTIVE' &&
      subscription.currentPeriodEnd &&
      subscription.currentPeriodEnd > new Date());

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          username: session.user.username,
          isPremium: !!isPremium,
          role: session.user.role,
        }}
      />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
      <Toaster />
    </div>
  );
}