import { pgTable, text, boolean, timestamp, integer, jsonb, primaryKey } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const cultivars = pgTable('cultivars', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  slug: text('slug').notNull().unique(),
  commonName: text('common_name').notNull(),
  genus: text('genus').notNull(),
  species: text('species'),
  origin: text('origin'),
  parentage: text('parentage'),
  yearIntroduced: integer('year_introduced'),
  description: text('description'),
  rarity: text('rarity').notNull().default('UNCOMMON'),
  isPremium: boolean('is_premium').notNull().default(false),
  leafShape: text('leaf_shape'),
  variegationType: text('variegation_type'),
  matureSize: text('mature_size'),
  lightNeed: text('light_need'),
  premiumNotes: text('premium_notes'),
  scentNotes: text('scent_notes'),
  growthLog: jsonb('growth_log'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const cultivarImages = pgTable('cultivar_images', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  cultivarId: text('cultivar_id').notNull().references(() => cultivars.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  type: text('type').notNull().default('GALLERY'),
  caption: text('caption'),
  isPremium: boolean('is_premium').notNull().default(false),
  uploadedBy: text('uploaded_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const traits = pgTable('traits', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull().unique(),
  category: text('category'),
});

export const cultivarTraits = pgTable('cultivar_traits', {
  cultivarId: text('cultivar_id').notNull().references(() => cultivars.id, { onDelete: 'cascade' }),
  traitId: text('trait_id').notNull().references(() => traits.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.cultivarId, t.traitId] }),
}));