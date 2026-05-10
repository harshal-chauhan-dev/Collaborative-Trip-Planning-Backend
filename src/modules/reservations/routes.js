import { Router } from 'express';
import { authRequired } from '../../middleware/authRequired.js';
import { tripAccess } from '../../middleware/tripAccess.js';
import { validate } from '../../middleware/validate.js';
import { createReservationSchema, updateReservationSchema } from './schemas.js';
import {
  listReservations,
  createReservation,
  updateReservation,
  deleteReservation,
} from './controller.js';

const tripReservationRouter = Router({ mergeParams: true });
const reservationRouter = Router();

tripReservationRouter.use(authRequired);

tripReservationRouter.get('/', tripAccess('viewer'), listReservations);
tripReservationRouter.post('/', validate(createReservationSchema), tripAccess('editor'), createReservation);

reservationRouter.use(authRequired);

reservationRouter.patch('/:reservationId', validate(updateReservationSchema), updateReservation);
reservationRouter.delete('/:reservationId', deleteReservation);

export { tripReservationRouter, reservationRouter };
