import { eq, and, asc } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { itineraryDays, activities } from '../../db/schema/index.js';
import { AppError } from '../../utils/AppError.js';

export const listDays = async (tripId) => {
  return db.query.itineraryDays.findMany({
    where: eq(itineraryDays.tripId, tripId),
    orderBy: (d, { asc }) => [asc(d.dayDate)],
    with: {
      activities: {
        orderBy: (a, { asc }) => [asc(a.position)],
      },
    },
  });
};

export const updateDay = async (dayId, data) => {
  const [updated] = await db
    .update(itineraryDays)
    .set(data)
    .where(eq(itineraryDays.id, dayId))
    .returning();

  if (!updated) throw new AppError('Day not found', 404, 'NOT_FOUND');

  return updated;
};

export const createActivity = async (dayId, userId, data) => {
  const day = await db.query.itineraryDays.findFirst({
    where: eq(itineraryDays.id, dayId),
  });

  if (!day) throw new AppError('Day not found', 404, 'NOT_FOUND');

  const existing = await db.query.activities.findMany({
    where: eq(activities.dayId, dayId),
    columns: { position: true },
    orderBy: [asc(activities.position)],
  });

  const position = existing.length > 0 ? existing[existing.length - 1].position + 1 : 0;

  const [activity] = await db
    .insert(activities)
    .values({ dayId, createdBy: userId, position, ...data })
    .returning();

  return activity;
};

export const updateActivity = async (activityId, data) => {
  const [updated] = await db
    .update(activities)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(activities.id, activityId))
    .returning();

  if (!updated) throw new AppError('Activity not found', 404, 'NOT_FOUND');

  return updated;
};

export const deleteActivity = async (activityId) => {
  const deleted = await db.delete(activities).where(eq(activities.id, activityId));

  if (deleted.rowCount === 0) throw new AppError('Activity not found', 404, 'NOT_FOUND');
};

export const listActivities = async (dayId) => {
  return db.query.activities.findMany({
    where: eq(activities.dayId, dayId),
    orderBy: (a, { asc }) => [asc(a.position)],
  });
};

export const reorderActivities = async (dayId, items) => {
  await db.transaction(async (tx) => {
    for (const item of items) {
      await tx
        .update(activities)
        .set({ position: item.position })
        .where(and(eq(activities.id, item.id), eq(activities.dayId, dayId)));
    }
  });

  return db.query.activities.findMany({
    where: eq(activities.dayId, dayId),
    orderBy: (a, { asc }) => [asc(a.position)],
  });
};
