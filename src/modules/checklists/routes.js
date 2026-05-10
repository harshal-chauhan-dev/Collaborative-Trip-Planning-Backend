import { Router } from 'express';
import { authRequired } from '../../middleware/authRequired.js';
import { tripAccess } from '../../middleware/tripAccess.js';
import { validate } from '../../middleware/validate.js';
import {
  createChecklistSchema,
  updateChecklistSchema,
  createItemSchema,
  updateItemSchema,
  reorderItemsSchema,
} from './schemas.js';
import {
  listChecklists,
  createChecklist,
  updateChecklist,
  deleteChecklist,
  createItem,
  updateItem,
  deleteItem,
  reorderItems,
} from './controller.js';

const tripChecklistRouter = Router({ mergeParams: true });
const checklistRouter = Router();

tripChecklistRouter.use(authRequired);

tripChecklistRouter.get('/', tripAccess('viewer'), listChecklists);
tripChecklistRouter.post('/', validate(createChecklistSchema), tripAccess('editor'), createChecklist);

checklistRouter.use(authRequired);

checklistRouter.patch('/:checklistId', validate(updateChecklistSchema), updateChecklist);
checklistRouter.delete('/:checklistId', deleteChecklist);
checklistRouter.post('/:checklistId/items', validate(createItemSchema), createItem);
checklistRouter.patch('/:checklistId/items/:itemId', validate(updateItemSchema), updateItem);
checklistRouter.delete('/:checklistId/items/:itemId', deleteItem);
checklistRouter.post('/:checklistId/items/reorder', validate(reorderItemsSchema), reorderItems);

export { tripChecklistRouter, checklistRouter };
