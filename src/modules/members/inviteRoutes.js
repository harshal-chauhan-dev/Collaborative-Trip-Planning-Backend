import { Router } from 'express';
import { authRequired } from '../../middleware/authRequired.js';
import { validate } from '../../middleware/validate.js';
import { acceptInviteSchema } from './schemas.js';
import { acceptInvite } from './controller.js';

const router = Router();

router.post('/accept', authRequired, validate(acceptInviteSchema), acceptInvite);

export default router;
