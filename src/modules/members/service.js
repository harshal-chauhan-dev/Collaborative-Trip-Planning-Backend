import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db/client.js';
import { users, tripMembers, tripInvites } from '../../db/schema/index.js';
import { AppError } from '../../utils/AppError.js';

export const listMembers = async (tripId) => {
  const members = await db.query.tripMembers.findMany({
    where: eq(tripMembers.tripId, tripId),
    with: { user: { columns: { id: true, name: true, email: true } } },
  });

  return members.map((m) => ({ ...m.user, role: m.role, joinedAt: m.joinedAt }));
};

export const inviteMember = async (tripId, invitedBy, { email, role }) => {
  const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });

  if (existingUser) {
    const alreadyMember = await db.query.tripMembers.findFirst({
      where: and(
        eq(tripMembers.tripId, tripId),
        eq(tripMembers.userId, existingUser.id),
      ),
    });

    if (alreadyMember) {
      throw new AppError('User is already a member of this trip', 409, 'ALREADY_MEMBER');
    }

    await db.insert(tripMembers).values({ tripId, userId: existingUser.id, role });

    return { directlyAdded: true, user: { id: existingUser.id, email, name: existingUser.name }, role };
  }

  const existingInvite = await db.query.tripInvites.findFirst({
    where: and(
      eq(tripInvites.tripId, tripId),
      eq(tripInvites.email, email),
      eq(tripInvites.status, 'pending'),
    ),
  });

  if (existingInvite) {
    throw new AppError('A pending invite already exists for this email', 409, 'INVITE_EXISTS');
  }

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const [invite] = await db
    .insert(tripInvites)
    .values({ tripId, email, role, token, invitedBy, expiresAt })
    .returning();

  return { directlyAdded: false, invite: { id: invite.id, email, role, token, expiresAt } };
};

export const acceptInvite = async (userId, token) => {
  const invite = await db.query.tripInvites.findFirst({
    where: eq(tripInvites.token, token),
  });

  if (!invite) {
    throw new AppError('Invite not found', 404, 'NOT_FOUND');
  }

  if (invite.status !== 'pending') {
    throw new AppError('Invite is no longer valid', 410, 'INVITE_EXPIRED');
  }

  if (new Date() > new Date(invite.expiresAt)) {
    await db
      .update(tripInvites)
      .set({ status: 'revoked' })
      .where(eq(tripInvites.id, invite.id));

    throw new AppError('Invite has expired', 410, 'INVITE_EXPIRED');
  }

  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });

  if (!user || user.email !== invite.email) {
    throw new AppError('This invite was sent to a different email address', 403, 'FORBIDDEN');
  }

  const alreadyMember = await db.query.tripMembers.findFirst({
    where: and(eq(tripMembers.tripId, invite.tripId), eq(tripMembers.userId, userId)),
  });

  if (!alreadyMember) {
    await db.insert(tripMembers).values({
      tripId: invite.tripId,
      userId,
      role: invite.role,
    });
  }

  await db
    .update(tripInvites)
    .set({ status: 'accepted' })
    .where(eq(tripInvites.id, invite.id));

  return { tripId: invite.tripId, role: invite.role };
};

export const updateMemberRole = async (tripId, targetUserId, role, requesterId) => {
  if (targetUserId === requesterId) {
    throw new AppError('You cannot change your own role', 400, 'BAD_REQUEST');
  }

  const membership = await db.query.tripMembers.findFirst({
    where: and(eq(tripMembers.tripId, tripId), eq(tripMembers.userId, targetUserId)),
  });

  if (!membership) {
    throw new AppError('Member not found', 404, 'NOT_FOUND');
  }

  if (membership.role === 'owner') {
    throw new AppError('Cannot change the role of the trip owner', 403, 'FORBIDDEN');
  }

  const [updated] = await db
    .update(tripMembers)
    .set({ role })
    .where(and(eq(tripMembers.tripId, tripId), eq(tripMembers.userId, targetUserId)))
    .returning();

  return updated;
};

export const removeMember = async (tripId, targetUserId, requesterId) => {
  const requesterMembership = await db.query.tripMembers.findFirst({
    where: and(eq(tripMembers.tripId, tripId), eq(tripMembers.userId, requesterId)),
  });

  if (targetUserId !== requesterId && requesterMembership?.role !== 'owner') {
    throw new AppError('Only the owner can remove other members', 403, 'FORBIDDEN');
  }

  const targetMembership = await db.query.tripMembers.findFirst({
    where: and(eq(tripMembers.tripId, tripId), eq(tripMembers.userId, targetUserId)),
  });

  if (!targetMembership) {
    throw new AppError('Member not found', 404, 'NOT_FOUND');
  }

  if (targetMembership.role === 'owner') {
    throw new AppError('Cannot remove the trip owner', 403, 'FORBIDDEN');
  }

  await db
    .delete(tripMembers)
    .where(and(eq(tripMembers.tripId, tripId), eq(tripMembers.userId, targetUserId)));
};

export const listInvites = async (tripId) => {
  return db.query.tripInvites.findMany({
    where: and(eq(tripInvites.tripId, tripId), eq(tripInvites.status, 'pending')),
    columns: { id: true, email: true, role: true, token: true, expiresAt: true, createdAt: true },
  });
};
