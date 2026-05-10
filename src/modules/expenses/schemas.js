import { z } from 'zod';

const expenseBody = z.object({
  category: z.string().min(1).max(100),
  description: z.string().optional(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Must be a valid decimal'),
  currency: z.string().length(3).default('USD'),
  paidByUserId: z.string().uuid(),
  occurredOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
});

export const createExpenseSchema = z.object({
  params: z.object({ tripId: z.string().uuid() }),
  body: expenseBody,
});

export const updateExpenseSchema = z.object({
  params: z.object({ expenseId: z.string().uuid() }),
  body: expenseBody.partial(),
});
