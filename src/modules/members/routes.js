import { Router } from 'express';
import { authRequired } from '../../middleware/authRequired.js';
import { tripAccess } from '../../middleware/tripAccess.js';
import { validate } from '../../middleware/validate.js';
import {
  inviteMemberSchema,
  updateMemberRoleSchema,
  removeMemberSchema,
} from './schemas.js';
import {
  listMembers,
  listInvites,
  inviteMember,
  updateMemberRole,
  removeMember,
} from './controller.js';

const router = Router({ mergeParams: true });

router.use(authRequired);

router.get('/', tripAccess('viewer'), listMembers);
router.get('/invites', tripAccess('owner'), listInvites);
router.post('/invites', validate(inviteMemberSchema), tripAccess('owner'), inviteMember);
router.patch('/:userId', validate(updateMemberRoleSchema), tripAccess('owner'), updateMemberRole);
router.delete('/:userId', validate(removeMemberSchema), tripAccess('viewer'), removeMember);

export default router;
