import { eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { expenses } from '../../db/schema/index.js';
import { AppError } from '../../utils/AppError.js';

export const listExpenses = async (tripId) => {
  return db.query.expenses.findMany({
    where: eq(expenses.tripId, tripId),
    with: { paidBy: { columns: { id: true, name: true } } },
    orderBy: (e, { desc }) => [desc(e.occurredOn)],
  });
};

export const createExpense = async (tripId, data) => {
  const [expense] = await db.insert(expenses).values({ tripId, ...data }).returning();
  return expense;
};

export const updateExpense = async (expenseId, data) => {
  const [updated] = await db
    .update(expenses)
    .set(data)
    .where(eq(expenses.id, expenseId))
    .returning();

  if (!updated) throw new AppError('Expense not found', 404, 'NOT_FOUND');

  return updated;
};

export const deleteExpense = async (expenseId) => {
  const deleted = await db.delete(expenses).where(eq(expenses.id, expenseId));

  if (deleted.rowCount === 0) throw new AppError('Expense not found', 404, 'NOT_FOUND');
};

export const getBudgetSummary = async (tripId) => {
  const allExpenses = await db.query.expenses.findMany({
    where: eq(expenses.tripId, tripId),
    with: { paidBy: { columns: { id: true, name: true } } },
  });

  const totalByCategory = {};
  const totalByPayer = {};
  const currencyTotals = {};

  for (const expense of allExpenses) {
    const amount = parseFloat(expense.amount);
    const { currency, category } = expense;
    const payerKey = expense.paidBy.name;

    totalByCategory[category] = (totalByCategory[category] ?? 0) + amount;
    totalByPayer[payerKey] = (totalByPayer[payerKey] ?? 0) + amount;
    currencyTotals[currency] = (currencyTotals[currency] ?? 0) + amount;
  }

  return { totalByCategory, totalByPayer, currencyTotals, count: allExpenses.length };
};
