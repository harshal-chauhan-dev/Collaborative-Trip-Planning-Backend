import { relations } from 'drizzle-orm';
import { users } from './users.js';
import { trips } from './trips.js';
import { tripMembers, tripInvites } from './members.js';
import { itineraryDays, activities } from './itinerary.js';
import { comments } from './comments.js';
import { checklists, checklistItems } from './checklists.js';
import { attachments } from './attachments.js';
import { reservations } from './reservations.js';
import { expenses } from './expenses.js';

export const usersRelations = relations(users, ({ many }) => ({
  trips: many(trips),
  memberships: many(tripMembers),
  activities: many(activities),
  comments: many(comments),
  expenses: many(expenses),
}));

export const tripsRelations = relations(trips, ({ one, many }) => ({
  owner: one(users, { fields: [trips.ownerId], references: [users.id] }),
  members: many(tripMembers),
  invites: many(tripInvites),
  days: many(itineraryDays),
  comments: many(comments),
  checklists: many(checklists),
  attachments: many(attachments),
  reservations: many(reservations),
  expenses: many(expenses),
}));

export const tripMembersRelations = relations(tripMembers, ({ one }) => ({
  trip: one(trips, { fields: [tripMembers.tripId], references: [trips.id] }),
  user: one(users, { fields: [tripMembers.userId], references: [users.id] }),
}));

export const tripInvitesRelations = relations(tripInvites, ({ one }) => ({
  trip: one(trips, { fields: [tripInvites.tripId], references: [trips.id] }),
  inviter: one(users, { fields: [tripInvites.invitedBy], references: [users.id] }),
}));

export const itineraryDaysRelations = relations(itineraryDays, ({ one, many }) => ({
  trip: one(trips, { fields: [itineraryDays.tripId], references: [trips.id] }),
  activities: many(activities),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  day: one(itineraryDays, { fields: [activities.dayId], references: [itineraryDays.id] }),
  createdBy: one(users, { fields: [activities.createdBy], references: [users.id] }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  trip: one(trips, { fields: [comments.tripId], references: [trips.id] }),
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
}));

export const checklistsRelations = relations(checklists, ({ one, many }) => ({
  trip: one(trips, { fields: [checklists.tripId], references: [trips.id] }),
  items: many(checklistItems),
}));

export const checklistItemsRelations = relations(checklistItems, ({ one }) => ({
  checklist: one(checklists, { fields: [checklistItems.checklistId], references: [checklists.id] }),
  assignee: one(users, { fields: [checklistItems.assigneeUserId], references: [users.id] }),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  trip: one(trips, { fields: [attachments.tripId], references: [trips.id] }),
  uploader: one(users, { fields: [attachments.uploadedBy], references: [users.id] }),
}));

export const reservationsRelations = relations(reservations, ({ one }) => ({
  trip: one(trips, { fields: [reservations.tripId], references: [trips.id] }),
  creator: one(users, { fields: [reservations.createdBy], references: [users.id] }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  trip: one(trips, { fields: [expenses.tripId], references: [trips.id] }),
  paidBy: one(users, { fields: [expenses.paidByUserId], references: [users.id] }),
}));
