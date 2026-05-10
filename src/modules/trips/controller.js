import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './service.js';

export const listTrips = asyncHandler(async (req, res) => {
  const trips = await service.listTrips(req.user.id);
  res.json({ trips });
});

export const createTrip = asyncHandler(async (req, res) => {
  const trip = await service.createTrip(req.user.id, req.validated.body);
  res.status(201).json({ trip });
});

export const getTrip = asyncHandler(async (req, res) => {
  res.json({ trip: req.trip, role: req.role });
});

export const updateTrip = asyncHandler(async (req, res) => {
  const trip = await service.updateTrip(req.params.tripId, req.validated.body);
  res.json({ trip });
});

export const deleteTrip = asyncHandler(async (req, res) => {
  await service.deleteTrip(req.params.tripId, req.user.id);
  res.status(204).send();
});
