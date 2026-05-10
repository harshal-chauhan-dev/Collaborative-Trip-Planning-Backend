import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './env.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './modules/auth/routes.js';
import tripRoutes from './modules/trips/routes.js';
import memberRoutes from './modules/members/routes.js';
import inviteRoutes from './modules/members/inviteRoutes.js';
import { dayRouter, activityRouter } from './modules/itinerary/routes.js';
import commentRoutes from './modules/comments/routes.js';
import { tripChecklistRouter, checklistRouter } from './modules/checklists/routes.js';
import { tripAttachmentRouter, attachmentRouter } from './modules/attachments/routes.js';
import { tripReservationRouter, reservationRouter } from './modules/reservations/routes.js';
import { tripExpenseRouter, expenseRouter } from './modules/expenses/routes.js';

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/trips/:tripId/members', memberRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/trips/:tripId/days', dayRouter);
app.use('/api/activities', activityRouter);
app.use('/api/trips/:tripId/comments', commentRoutes);
app.use('/api/trips/:tripId/checklists', tripChecklistRouter);
app.use('/api/checklists', checklistRouter);
app.use('/api/trips/:tripId/attachments', tripAttachmentRouter);
app.use('/api/attachments', attachmentRouter);
app.use('/api/trips/:tripId/reservations', tripReservationRouter);
app.use('/api/reservations', reservationRouter);
app.use('/api/trips/:tripId/expenses', tripExpenseRouter);
app.use('/api/expenses', expenseRouter);

app.use(errorHandler);

export default app;
