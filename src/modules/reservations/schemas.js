import { z } from 'zod';

const reservationBody = z.object({
  kind: z.enum(['flight', 'hotel', 'car', 'other']).default('other'),
  title: z.string().min(1).max(255),
  vendor: z.string().max(255).optional(),
  confirmationNumber: z.string().max(100).optional(),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  location: z.string().max(255).optional(),
  cost: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Must be a valid decimal').optional(),
  currency: z.string().length(3).default('USD'),
  notes: z.string().optional(),
});

export const createReservationSchema = z.object({
  params: z.object({ tripId: z.string().uuid() }),
  body: reservationBody,
});

export const updateReservationSchema = z.object({
  params: z.object({ reservationId: z.string().uuid() }),
  body: reservationBody.partial(),
});
