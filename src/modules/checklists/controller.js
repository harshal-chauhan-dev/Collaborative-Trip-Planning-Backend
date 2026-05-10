import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './service.js';

export const listChecklists = asyncHandler(async (req, res) => {
  const checklists = await service.listChecklists(req.params.tripId);
  res.json({ checklists });
});

export const createChecklist = asyncHandler(async (req, res) => {
  const checklist = await service.createChecklist(req.params.tripId, req.validated.body);
  res.status(201).json({ checklist });
});

export const updateChecklist = asyncHandler(async (req, res) => {
  const checklist = await service.updateChecklist(req.params.checklistId, req.validated.body);
  res.json({ checklist });
});

export const deleteChecklist = asyncHandler(async (req, res) => {
  await service.deleteChecklist(req.params.checklistId);
  res.status(204).send();
});

export const createItem = asyncHandler(async (req, res) => {
  const item = await service.createItem(req.params.checklistId, req.validated.body);
  res.status(201).json({ item });
});

export const updateItem = asyncHandler(async (req, res) => {
  const item = await service.updateItem(req.params.itemId, req.validated.body);
  res.json({ item });
});

export const deleteItem = asyncHandler(async (req, res) => {
  await service.deleteItem(req.params.itemId);
  res.status(204).send();
});

export const reorderItems = asyncHandler(async (req, res) => {
  const items = await service.reorderItems(req.params.checklistId, req.validated.body);
  res.json({ items });
});
