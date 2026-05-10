import { eq, and } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { trips, tripMembers, itineraryDays } from '../../db/schema/index.js';
import { AppError } from '../../utils/AppError.js';

const eachDateInRange = (start, end) => {
  const dates = [];
  const current = new Date(start);
  const last = new Date(end);

  while (current <= last) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

const materializeDays = async (tripId, startDate, endDate) => {
  const dates = eachDateInRange(startDate, endDate);

  await db
    .insert(itineraryDays)
    .values(dates.map((dayDate) => ({ tripId, dayDate })))
    .onConflictDoNothing();
};

export const createTrip = async (userId, data) => {
  const [trip] = await db
    .insert(trips)
    .values({ ...data, ownerId: userId })
    .returning();

  await db.insert(tripMembers).values({ tripId: trip.id, userId, role: 'owner' });
  await materializeDays(trip.id, data.startDate, data.endDate);

  return trip;
};

export const listTrips = async (userId) => {
  const memberships = await db.query.tripMembers.findMany({
    where: eq(tripMembers.userId, userId),
    with: { trip: true },
    orderBy: (tm, { desc }) => [desc(tm.joinedAt)],
  });

  return memberships.map((m) => ({ ...m.trip, role: m.role }));
};

export const getTripById = async (tripId) => {
  const trip = await db.query.trips.findFirst({ where: eq(trips.id, tripId) });

  if (!trip) throw new AppError('Trip not found', 404, 'NOT_FOUND');

  return trip;
};

export const updateTrip = async (tripId, data) => {
  const [updated] = await db
    .update(trips)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(trips.id, tripId))
    .returning();

  if (data.startDate || data.endDate) {
    const current = await getTripById(tripId);
    await materializeDays(
      tripId,
      data.startDate ?? current.startDate,
      data.endDate ?? current.endDate,
    );
  }

  return updated;
};

export const deleteTrip = async (tripId, userId) => {
  const membership = await db.query.tripMembers.findFirst({
    where: and(eq(tripMembers.tripId, tripId), eq(tripMembers.userId, userId)),
  });

  if (!membership || membership.role !== 'owner') {
    throw new AppError('Only the owner can delete a trip', 403, 'FORBIDDEN');
  }

  await db.delete(trips).where(eq(trips.id, tripId));
};
