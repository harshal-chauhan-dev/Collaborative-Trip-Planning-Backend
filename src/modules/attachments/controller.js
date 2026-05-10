import path from 'path';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { AppError } from '../../utils/AppError.js';
import * as service from './service.js';

export const listAttachments = asyncHandler(async (req, res) => {
  const { parentType, parentId } = req.validated.query;
  const attachments = await service.listAttachments(req.params.tripId, parentType, parentId);
  res.json({ attachments });
});

export const uploadAttachment = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400, 'NO_FILE');
  }

  const parentType = req.body.parentType ?? 'trip';
  const parentId = req.body.parentId ?? req.params.tripId;

  const attachment = await service.saveAttachment(
    req.params.tripId,
    req.user.id,
    req.file,
    { parentType, parentId },
  );

  res.status(201).json({ attachment });
});

export const downloadAttachment = asyncHandler(async (req, res) => {
  const attachment = await service.getAttachment(req.params.attachmentId);
  res.download(path.resolve(attachment.storagePath), attachment.fileName);
});

export const deleteAttachment = asyncHandler(async (req, res) => {
  await service.deleteAttachment(req.params.attachmentId);
  res.status(204).send();
});
