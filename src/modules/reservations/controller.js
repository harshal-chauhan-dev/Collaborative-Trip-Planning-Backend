import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './service.js';

export const listReservations = asyncHandler(async (req, res) => {
  const reservations = await service.listReservations(req.params.tripId);
  res.json({ reservations });
});

export const createReservation = asyncHandler(async (req, res) => {
  const reservation = await service.createReservation(
    req.params.tripId,
    req.user.id,
    req.validated.body,
  );
  res.status(201).json({ reservation });
});

export const updateReservation = asyncHandler(async (req, res) => {
  const reservation = await service.updateReservation(
    req.params.reservationId,
    req.validated.body,
  );
  res.json({ reservation });
});

export const deleteReservation = asyncHandler(async (req, res) => {
  await service.deleteReservation(req.params.reservationId);
  res.status(204).send();
});
