import { eq, and } from 'drizzle-orm';
import fs from 'fs/promises';
import { db } from '../../db/client.js';
import { attachments } from '../../db/schema/index.js';
import { AppError } from '../../utils/AppError.js';

export const listAttachments = async (tripId, parentType, parentId) => {
  const conditions = [eq(attachments.tripId, tripId)];

  if (parentType) conditions.push(eq(attachments.parentType, parentType));
  if (parentId) conditions.push(eq(attachments.parentId, parentId));

  return db.query.attachments.findMany({
    where: and(...conditions),
    orderBy: (a, { desc }) => [desc(a.createdAt)],
  });
};

export const saveAttachment = async (tripId, uploadedBy, file, { parentType, parentId }) => {
  const [attachment] = await db
    .insert(attachments)
    .values({
      tripId,
      parentType,
      parentId: parentId ?? tripId,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      storagePath: file.path,
      uploadedBy,
    })
    .returning();

  return attachment;
};

export const getAttachment = async (attachmentId) => {
  const attachment = await db.query.attachments.findFirst({
    where: eq(attachments.id, attachmentId),
  });

  if (!attachment) throw new AppError('Attachment not found', 404, 'NOT_FOUND');

  return attachment;
};

export const deleteAttachment = async (attachmentId) => {
  const attachment = await getAttachment(attachmentId);

  try {
    await fs.unlink(attachment.storagePath);
  } catch {
    // File may already be missing from disk
  }

  await db.delete(attachments).where(eq(attachments.id, attachmentId));
};
