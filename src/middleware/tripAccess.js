import { eq, and } from 'drizzle-orm';
import { db } from '../db/client.js';
import { trips, tripMembers } from '../db/schema/index.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hasRole } from '../utils/roles.js';

export const tripAccess = (minRole = 'viewer') =>
  asyncHandler(async (req, _res, next) => {
    const { tripId } = req.params;

    const trip = await db.query.trips.findFirst({
      where: eq(trips.id, tripId),
    });

    if (!trip) {
      return next(new AppError('Trip not found', 404, 'NOT_FOUND'));
    }

    const membership = await db.query.tripMembers.findFirst({
      where: and(eq(tripMembers.tripId, tripId), eq(tripMembers.userId, req.user.id)),
    });

    if (!membership) {
      return next(new AppError('You are not a member of this trip', 403, 'FORBIDDEN'));
    }

    if (!hasRole(membership.role, minRole)) {
      return next(
        new AppError(
          `This action requires at least ${minRole} role`,
          403,
          'INSUFFICIENT_ROLE',
        ),
      );
    }

    req.trip = trip;
    req.role = membership.role;
    next();
  });
