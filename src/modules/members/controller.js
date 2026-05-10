import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './service.js';

export const listMembers = asyncHandler(async (req, res) => {
  const members = await service.listMembers(req.params.tripId);
  res.json({ members });
});

export const listInvites = asyncHandler(async (req, res) => {
  const invites = await service.listInvites(req.params.tripId);
  res.json({ invites });
});

export const inviteMember = asyncHandler(async (req, res) => {
  const result = await service.inviteMember(
    req.params.tripId,
    req.user.id,
    req.validated.body,
  );
  res.status(201).json(result);
});

export const updateMemberRole = asyncHandler(async (req, res) => {
  const updated = await service.updateMemberRole(
    req.params.tripId,
    req.params.userId,
    req.validated.body.role,
    req.user.id,
  );
  res.json({ member: updated });
});

export const removeMember = asyncHandler(async (req, res) => {
  await service.removeMember(req.params.tripId, req.params.userId, req.user.id);
  res.status(204).send();
});

export const acceptInvite = asyncHandler(async (req, res) => {
  const result = await service.acceptInvite(req.user.id, req.validated.body.token);
  res.json(result);
});
