import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './service.js';

export const listComments = asyncHandler(async (req, res) => {
  const { parentType, parentId } = req.validated.query;
  const comments = await service.listComments(req.params.tripId, parentType, parentId);
  res.json({ comments });
});

export const createComment = asyncHandler(async (req, res) => {
  const comment = await service.createComment(
    req.params.tripId,
    req.user.id,
    req.validated.body,
  );
  res.status(201).json({ comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
  await service.deleteComment(req.params.commentId, req.user.id, req.role);
  res.status(204).send();
});
