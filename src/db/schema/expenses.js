import { pgTable, uuid, varchar, text, numeric, date, timestamp } from 'drizzle-orm/pg-core';
import { trips } from './trips.js';
import { users } from './users.js';

export const expenses = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id')
    .notNull()
    .references(() => trips.id, { onDelete: 'cascade' }),
  category: varchar('category', { length: 100 }).notNull(),
  description: text('description'),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  paidByUserId: uuid('paid_by_user_id')
    .notNull()
    .references(() => users.id),
  occurredOn: date('occurred_on').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
