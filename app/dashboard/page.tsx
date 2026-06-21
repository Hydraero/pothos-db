import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { subscriptions, userCultivars, verificationsCollection } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const [collection, verifications, subscription] = await Promise.all([
    db.query.userCultivars.findMany({
      where: eq(userCultivars.userId, session.user.id),
    }),
    db.query.verificationsCollection.findMany({
      where: eq(verificationsCollection.userId, session.user.id),
    }),
    db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, session.user.id),
    }),
  ]);

  const isPremium =
    session.user.hasLifetimeAccess ||
    (subscription?.status === 'ACTIVE' &&
      subscription.currentPeriodEnd &&
      subscription.currentPeriodEnd > new Date());

  const approvedVerifications = verifications.filter((v) => v.status === 'APPROVED').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session.user.name?.split(' ')[0] || 'planter'}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your rare pothos collection and verifications
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Collection</CardDescription>
            <CardTitle className="text-3xl">{collection.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/collection">
              <Button variant="link" className="px-0">Manage →</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Verified Badges</CardDescription>
            <CardTitle className="text-3xl">{approvedVerifications}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/verifications">
              <Button variant="link" className="px-0">View →</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Subscription</CardDescription>
            <CardTitle className="text-3xl">
              {isPremium ? 'Premium' : 'Free'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/pricing">
              <Button variant="link" className="px-0">
                {isPremium ? 'Manage' : 'Upgrade'} →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {!session.user.emailVerified && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>
              Check your inbox for a verification link to unlock all features
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}