import { z } from 'zod';

const ROLES = ['editor', 'viewer'];

export const inviteMemberSchema = z.object({
  params: z.object({ tripId: z.string().uuid() }),
  body: z.object({
    email: z.string().email(),
    role: z.enum(['editor', 'viewer']).default('viewer'),
  }),
});

export const updateMemberRoleSchema = z.object({
  params: z.object({ tripId: z.string().uuid(), userId: z.string().uuid() }),
  body: z.object({
    role: z.enum(ROLES),
  }),
});

export const removeMemberSchema = z.object({
  params: z.object({ tripId: z.string().uuid(), userId: z.string().uuid() }),
});

export const acceptInviteSchema = z.object({
  body: z.object({
    token: z.string().min(1),
  }),
});
