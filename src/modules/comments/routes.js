import { Router } from 'express';
import { authRequired } from '../../middleware/authRequired.js';
import { tripAccess } from '../../middleware/tripAccess.js';
import { validate } from '../../middleware/validate.js';
import { listCommentsSchema, createCommentSchema, deleteCommentSchema } from './schemas.js';
import { listComments, createComment, deleteComment } from './controller.js';

const router = Router({ mergeParams: true });

router.use(authRequired);

router.get('/', validate(listCommentsSchema), tripAccess('viewer'), listComments);
router.post('/', validate(createCommentSchema), tripAccess('viewer'), createComment);
router.delete('/:commentId', validate(deleteCommentSchema), tripAccess('viewer'), deleteComment);

export default router;
