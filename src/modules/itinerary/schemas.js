import { z } from 'zod';

export const updateDaySchema = z.object({
  params: z.object({ tripId: z.string().uuid(), dayId: z.string().uuid() }),
  body: z.object({
    notes: z.string().nullable().optional(),
  }),
});

export const createActivitySchema = z.object({
  params: z.object({ tripId: z.string().uuid(), dayId: z.string().uuid() }),
  body: z.object({
    title: z.string().min(1).max(255),
    description: z.string().optional(),
    location: z.string().max(255).optional(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:MM').optional(),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:MM').optional(),
  }),
});

export const updateActivitySchema = z.object({
  params: z.object({ activityId: z.string().uuid() }),
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().nullable().optional(),
    location: z.string().max(255).nullable().optional(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
    endTime: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  }),
});

export const reorderActivitiesSchema = z.object({
  params: z.object({ tripId: z.string().uuid(), dayId: z.string().uuid() }),
  body: z.array(z.object({ id: z.string().uuid(), position: z.number().int().min(0) })).min(1),
});
