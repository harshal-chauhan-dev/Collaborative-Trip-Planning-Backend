import { pgTable, uuid, varchar, text, numeric, timestamp } from 'drizzle-orm/pg-core';
import { trips } from './trips.js';
import { users } from './users.js';

export const reservations = pgTable('reservations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id')
    .notNull()
    .references(() => trips.id, { onDelete: 'cascade' }),
  kind: varchar('kind', { length: 20 }).notNull().default('other'),
  title: varchar('title', { length: 255 }).notNull(),
  vendor: varchar('vendor', { length: 255 }),
  confirmationNumber: varchar('confirmation_number', { length: 100 }),
  startAt: timestamp('start_at'),
  endAt: timestamp('end_at'),
  location: varchar('location', { length: 255 }),
  cost: numeric('cost', { precision: 12, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('USD'),
  notes: text('notes'),
  createdBy: uuid('created_by')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
