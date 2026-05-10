import { Router } from 'express';
import { authRequired } from '../../middleware/authRequired.js';
import { tripAccess } from '../../middleware/tripAccess.js';
import { validate } from '../../middleware/validate.js';
import { createExpenseSchema, updateExpenseSchema } from './schemas.js';
import {
  listExpenses,
  createExpense,
  getBudgetSummary,
  updateExpense,
  deleteExpense,
} from './controller.js';

const tripExpenseRouter = Router({ mergeParams: true });
const expenseRouter = Router();

tripExpenseRouter.use(authRequired);

tripExpenseRouter.get('/', tripAccess('viewer'), listExpenses);
tripExpenseRouter.post('/', validate(createExpenseSchema), tripAccess('editor'), createExpense);
tripExpenseRouter.get('/summary', tripAccess('viewer'), getBudgetSummary);

expenseRouter.use(authRequired);

expenseRouter.patch('/:expenseId', validate(updateExpenseSchema), updateExpense);
expenseRouter.delete('/:expenseId', deleteExpense);

export { tripExpenseRouter, expenseRouter };
