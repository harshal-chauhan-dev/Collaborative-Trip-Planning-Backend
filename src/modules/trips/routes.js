import { Router } from 'express';
import { authRequired } from '../../middleware/authRequired.js';
import { tripAccess } from '../../middleware/tripAccess.js';
import { validate } from '../../middleware/validate.js';
import { createTripSchema, updateTripSchema, tripParamSchema } from './schemas.js';
import { listTrips, createTrip, getTrip, updateTrip, deleteTrip } from './controller.js';

const router = Router();

router.use(authRequired);

router.get('/', listTrips);
router.post('/', validate(createTripSchema), createTrip);
router.get('/:tripId', validate(tripParamSchema), tripAccess('viewer'), getTrip);
router.patch('/:tripId', validate(updateTripSchema), tripAccess('editor'), updateTrip);
router.delete('/:tripId', validate(tripParamSchema), tripAccess('owner'), deleteTrip);

export default router;
