import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/AppError';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
    req.user = req.session.user;
    return next();
  }

  next(new UnauthorizedError('Please log in to access this resource'));
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role || '')) {
      return next(new UnauthorizedError('Insufficient permissions'));
    }
    next();
  };
};

export default authenticate;
