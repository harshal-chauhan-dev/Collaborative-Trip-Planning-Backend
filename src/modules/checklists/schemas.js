import { z } from 'zod';

export const createChecklistSchema = z.object({
  params: z.object({ tripId: z.string().uuid() }),
  body: z.object({
    title: z.string().min(1).max(255),
    kind: z.enum(['packing', 'todo', 'other']).default('todo'),
  }),
});

export const updateChecklistSchema = z.object({
  params: z.object({ checklistId: z.string().uuid() }),
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    kind: z.enum(['packing', 'todo', 'other']).optional(),
  }),
});

export const createItemSchema = z.object({
  params: z.object({ checklistId: z.string().uuid() }),
  body: z.object({
    label: z.string().min(1).max(255),
    assigneeUserId: z.string().uuid().nullable().optional(),
  }),
});

export const updateItemSchema = z.object({
  params: z.object({ checklistId: z.string().uuid(), itemId: z.string().uuid() }),
  body: z.object({
    label: z.string().min(1).max(255).optional(),
    isDone: z.boolean().optional(),
    assigneeUserId: z.string().uuid().nullable().optional(),
  }),
});

export const reorderItemsSchema = z.object({
  params: z.object({ checklistId: z.string().uuid() }),
  body: z.array(z.object({ id: z.string().uuid(), position: z.number().int().min(0) })).min(1),
});
