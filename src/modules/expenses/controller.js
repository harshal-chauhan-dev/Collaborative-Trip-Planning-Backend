import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './service.js';

export const listExpenses = asyncHandler(async (req, res) => {
  const expenses = await service.listExpenses(req.params.tripId);
  res.json({ expenses });
});

export const createExpense = asyncHandler(async (req, res) => {
  const expense = await service.createExpense(req.params.tripId, req.validated.body);
  res.status(201).json({ expense });
});

export const getBudgetSummary = asyncHandler(async (req, res) => {
  const summary = await service.getBudgetSummary(req.params.tripId);
  res.json({ summary });
});

export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await service.updateExpense(req.params.expenseId, req.validated.body);
  res.json({ expense });
});

export const deleteExpense = asyncHandler(async (req, res) => {
  await service.deleteExpense(req.params.expenseId);
  res.status(204).send();
});
