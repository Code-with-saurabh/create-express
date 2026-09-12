import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from './AppError';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  next(new NotFoundError(`Route ${req.method} ${req.path}`));
};

export default notFoundHandler;
