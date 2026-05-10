import { pgTable, uuid, varchar, date, integer, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const trips = pgTable('trips', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  travelerCount: integer('traveler_count').notNull().default(1),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
