import { verifyToken } from '../auth/jwt.js';
import { AppError } from '../utils/AppError.js';

export const authRequired = (req, _res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401, 'INVALID_TOKEN'));
  }
};
