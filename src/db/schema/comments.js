import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { trips } from './trips.js';
import { users } from './users.js';

export const comments = pgTable(
  'comments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tripId: uuid('trip_id')
      .notNull()
      .references(() => trips.id, { onDelete: 'cascade' }),
    parentType: varchar('parent_type', { length: 20 }).notNull(),
    parentId: uuid('parent_id').notNull(),
    authorId: uuid('author_id')
      .notNull()
      .references(() => users.id),
    body: text('body').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    parentIdx: index('comments_parent_idx').on(table.parentType, table.parentId),
    tripIdx: index('comments_trip_idx').on(table.tripId),
  }),
);
