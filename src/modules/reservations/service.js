import { eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { reservations } from '../../db/schema/index.js';
import { AppError } from '../../utils/AppError.js';

export const listReservations = async (tripId) => {
  return db.query.reservations.findMany({
    where: eq(reservations.tripId, tripId),
    orderBy: (r, { asc }) => [asc(r.startAt)],
  });
};

export const createReservation = async (tripId, createdBy, data) => {
  const [reservation] = await db
    .insert(reservations)
    .values({ tripId, createdBy, ...data })
    .returning();

  return reservation;
};

export const updateReservation = async (reservationId, data) => {
  const [updated] = await db
    .update(reservations)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(reservations.id, reservationId))
    .returning();

  if (!updated) throw new AppError('Reservation not found', 404, 'NOT_FOUND');

  return updated;
};

export const deleteReservation = async (reservationId) => {
  const deleted = await db.delete(reservations).where(eq(reservations.id, reservationId));

  if (deleted.rowCount === 0) throw new AppError('Reservation not found', 404, 'NOT_FOUND');
};
