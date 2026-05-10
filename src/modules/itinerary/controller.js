import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './service.js';

export const listDays = asyncHandler(async (req, res) => {
  const days = await service.listDays(req.params.tripId);
  res.json({ days });
});

export const updateDay = asyncHandler(async (req, res) => {
  const day = await service.updateDay(req.params.dayId, req.validated.body);
  res.json({ day });
});

export const createActivity = asyncHandler(async (req, res) => {
  const activity = await service.createActivity(
    req.params.dayId,
    req.user.id,
    req.validated.body,
  );
  res.status(201).json({ activity });
});

export const listActivities = asyncHandler(async (req, res) => {
  const list = await service.listActivities(req.params.dayId);
  res.json({ activities: list });
});

export const reorderActivities = asyncHandler(async (req, res) => {
  const ordered = await service.reorderActivities(req.params.dayId, req.validated.body);
  res.json({ activities: ordered });
});

export const updateActivity = asyncHandler(async (req, res) => {
  const activity = await service.updateActivity(req.params.activityId, req.validated.body);
  res.json({ activity });
});

export const deleteActivity = asyncHandler(async (req, res) => {
  await service.deleteActivity(req.params.activityId);
  res.status(204).send();
});
