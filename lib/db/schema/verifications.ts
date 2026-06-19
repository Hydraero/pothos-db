import { pgTable, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { users } from './users';
import { cultivars } from './cultivars';

export const verificationsCollection = pgTable('verifications_collection', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  cultivarId: text('cultivar_id').notNull().references(() => cultivars.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('PENDING'),
  code: text('code').notNull().unique(),
  photoUrl: text('photo_url'),
  adminNotes: text('admin_notes'),
  feePaid: boolean('fee_paid').notNull().default(false),
  amount: integer('amount'),
  stripePaymentId: text('stripe_payment_id'),
  reviewedBy: text('reviewed_by').references(() => users.id),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});