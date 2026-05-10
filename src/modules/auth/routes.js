import { Router } from 'express';
import { authRequired } from '../../middleware/authRequired.js';
import { validate } from '../../middleware/validate.js';
import { registerSchema, loginSchema } from './schemas.js';
import { register, login, logout, me } from './controller.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authRequired, me);

export default router;
