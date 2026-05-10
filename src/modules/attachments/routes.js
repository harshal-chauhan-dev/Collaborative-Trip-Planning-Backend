import { Router } from 'express';
import { authRequired } from '../../middleware/authRequired.js';
import { tripAccess } from '../../middleware/tripAccess.js';
import { validate } from '../../middleware/validate.js';
import { upload } from '../../middleware/upload.js';
import { listAttachmentsSchema } from './schemas.js';
import {
  listAttachments,
  uploadAttachment,
  downloadAttachment,
  deleteAttachment,
} from './controller.js';

const tripAttachmentRouter = Router({ mergeParams: true });
const attachmentRouter = Router();

tripAttachmentRouter.use(authRequired);

tripAttachmentRouter.get('/', validate(listAttachmentsSchema), tripAccess('viewer'), listAttachments);
tripAttachmentRouter.post('/', tripAccess('editor'), upload.single('file'), uploadAttachment);

attachmentRouter.use(authRequired);

attachmentRouter.get('/:attachmentId/download', downloadAttachment);
attachmentRouter.delete('/:attachmentId', deleteAttachment);

export { tripAttachmentRouter, attachmentRouter };
