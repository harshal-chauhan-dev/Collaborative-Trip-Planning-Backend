import { z } from 'zod';

export const listCommentsSchema = z.object({
  params: z.object({ tripId: z.string().uuid() }),
  query: z.object({
    parentType: z.enum(['day', 'activity']),
    parentId: z.string().uuid(),
  }),
});

export const createCommentSchema = z.object({
  params: z.object({ tripId: z.string().uuid() }),
  body: z.object({
    parentType: z.enum(['day', 'activity']),
    parentId: z.string().uuid(),
    body: z.string().min(1).max(5000),
  }),
});

export const deleteCommentSchema = z.object({
  params: z.object({ tripId: z.string().uuid(), commentId: z.string().uuid() }),
});
