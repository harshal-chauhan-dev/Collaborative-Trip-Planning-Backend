import { pgTable, uuid, varchar, text, date, integer, time, timestamp, unique } from 'drizzle-orm/pg-core';
import { trips } from './trips.js';
import { users } from './users.js';

export const itineraryDays = pgTable(
  'itinerary_days',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tripId: uuid('trip_id')
      .notNull()
      .references(() => trips.id, { onDelete: 'cascade' }),
    dayDate: date('day_date').notNull(),
    notes: text('notes'),
  },
  (table) => ({
    uniqueTripDay: unique().on(table.tripId, table.dayDate),
  }),
);

export const activities = pgTable('activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  dayId: uuid('day_id')
    .notNull()
    .references(() => itineraryDays.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  location: varchar('location', { length: 255 }),
  startTime: time('start_time'),
  endTime: time('end_time'),
  position: integer('position').notNull().default(0),
  createdBy: uuid('created_by')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
