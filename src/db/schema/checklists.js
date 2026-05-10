import { pgTable, uuid, varchar, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { trips } from './trips.js';
import { users } from './users.js';

export const checklists = pgTable('checklists', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id')
    .notNull()
    .references(() => trips.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  kind: varchar('kind', { length: 20 }).notNull().default('todo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const checklistItems = pgTable('checklist_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  checklistId: uuid('checklist_id')
    .notNull()
    .references(() => checklists.id, { onDelete: 'cascade' }),
  label: varchar('label', { length: 255 }).notNull(),
  isDone: boolean('is_done').notNull().default(false),
  position: integer('position').notNull().default(0),
  assigneeUserId: uuid('assignee_user_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
