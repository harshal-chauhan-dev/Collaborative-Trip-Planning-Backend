import { eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { users } from '../../db/schema/index.js';
import { hashPassword, verifyPassword } from '../../auth/password.js';
import { signToken } from '../../auth/jwt.js';
import { AppError } from '../../utils/AppError.js';

const omitPassword = (user) => {
  const { passwordHash: _pw, ...rest } = user;
  return rest;
};

export const register = async ({ name, email, password }) => {
  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });

  if (existing) {
    throw new AppError('Email already in use', 409, 'EMAIL_CONFLICT');
  }

  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values({ name, email, passwordHash })
    .returning({ id: users.id, name: users.name, email: users.email, createdAt: users.createdAt });

  const token = signToken({ id: user.id, email: user.email });

  return { user, token };
};

export const login = async ({ email, password }) => {
  const user = await db.query.users.findFirst({ where: eq(users.email, email) });

  if (!user) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const valid = await verifyPassword(password, user.passwordHash);

  if (!valid) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const token = signToken({ id: user.id, email: user.email });

  const safeUser = omitPassword(user);

  return { user: safeUser, token };
};

export const getMe = async (userId) => {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });

  if (!user) {
    throw new AppError('User not found', 404, 'NOT_FOUND');
  }

  return omitPassword(user);
};
