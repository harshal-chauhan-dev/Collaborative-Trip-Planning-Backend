import { z } from 'zod';

export const createTripSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
    travelerCount: z.number().int().min(1).default(1),
  }).refine((d) => d.endDate >= d.startDate, {
    message: 'endDate must be on or after startDate',
    path: ['endDate'],
  }),
});

export const updateTripSchema = z.object({
  params: z.object({ tripId: z.string().uuid() }),
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    travelerCount: z.number().int().min(1).optional(),
  }),
});

export const tripParamSchema = z.object({
  params: z.object({ tripId: z.string().uuid() }),
});
