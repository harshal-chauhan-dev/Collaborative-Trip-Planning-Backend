import { Router } from 'express';
import { authRequired } from '../../middleware/authRequired.js';
import { tripAccess } from '../../middleware/tripAccess.js';
import { validate } from '../../middleware/validate.js';
import {
  updateDaySchema,
  createActivitySchema,
  updateActivitySchema,
  reorderActivitiesSchema,
} from './schemas.js';
import {
  listDays,
  updateDay,
  createActivity,
  listActivities,
  reorderActivities,
  updateActivity,
  deleteActivity,
} from './controller.js';

const dayRouter = Router({ mergeParams: true });
const activityRouter = Router();

dayRouter.use(authRequired);

dayRouter.get('/', tripAccess('viewer'), listDays);
dayRouter.patch('/:dayId', validate(updateDaySchema), tripAccess('editor'), updateDay);
dayRouter.post('/:dayId/activities', validate(createActivitySchema), tripAccess('editor'), createActivity);
dayRouter.get('/:dayId/activities', tripAccess('viewer'), listActivities);
dayRouter.post('/:dayId/activities/reorder', validate(reorderActivitiesSchema), tripAccess('editor'), reorderActivities);

activityRouter.use(authRequired);

activityRouter.patch('/:activityId', validate(updateActivitySchema), updateActivity);
activityRouter.delete('/:activityId', deleteActivity);

export { dayRouter, activityRouter };
