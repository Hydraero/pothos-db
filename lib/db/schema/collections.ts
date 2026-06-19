import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { users } from './users';
import { cultivars } from './cultivars';

export const userCultivars = pgTable('user_cultivars', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  cultivarId: text('cultivar_id').notNull().references(() => cultivars.id, { onDelete: 'cascade' }),
  nickname: text('nickname'),
  acquiredAt: timestamp('acquired_at', { withTimezone: true }),
  notes: text('notes'),
  isPublic: boolean('is_public').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const userPlantImages = pgTable('user_plant_images', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userCultivarId: text('user_cultivar_id').notNull().references(() => userCultivars.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  takenAt: timestamp('taken_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});