import { asyncHandler } from '../../utils/asyncHandler.js';
import { env } from '../../env.js';
import * as service from './service.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  domain: env.COOKIE_DOMAIN,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await service.register(req.validated.body);
  res.cookie('token', token, COOKIE_OPTIONS);
  res.status(201).json({ user });
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await service.login(req.validated.body);
  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({ user });
});

export const logout = (_req, res) => {
  res.clearCookie('token', { domain: env.COOKIE_DOMAIN });
  res.json({ message: 'Logged out successfully' });
};

export const me = asyncHandler(async (req, res) => {
  const user = await service.getMe(req.user.id);
  res.json({ user });
});
