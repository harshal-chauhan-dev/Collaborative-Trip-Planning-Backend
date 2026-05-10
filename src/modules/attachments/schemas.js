import { z } from 'zod';

export const listAttachmentsSchema = z.object({
  params: z.object({ tripId: z.string().uuid() }),
  query: z.object({
    parentType: z.enum(['trip', 'day', 'activity', 'reservation']).optional(),
    parentId: z.string().uuid().optional(),
  }),
});

export const uploadAttachmentSchema = z.object({
  params: z.object({ tripId: z.string().uuid() }),
  body: z.object({
    parentType: z.enum(['trip', 'day', 'activity', 'reservation']).default('trip'),
    parentId: z.string().uuid().optional(),
  }),
});
