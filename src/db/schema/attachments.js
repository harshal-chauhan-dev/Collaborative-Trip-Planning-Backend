import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { trips } from './trips.js';
import { users } from './users.js';

export const attachments = pgTable('attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id')
    .notNull()
    .references(() => trips.id, { onDelete: 'cascade' }),
  parentType: varchar('parent_type', { length: 30 }).notNull(),
  parentId: uuid('parent_id').notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: integer('size').notNull(),
  storagePath: varchar('storage_path', { length: 500 }).notNull(),
  uploadedBy: uuid('uploaded_by')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
