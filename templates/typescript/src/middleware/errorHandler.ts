import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { logger } from '../config/logger';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const status = (err as AppError).statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && status === 500
    ? 'An unexpected error occurred'
    : err.message;

  logger.error({
    err: {
      message: err.message,
      stack: err.stack,
      type: (err as AppError).type || 'INTERNAL_ERROR',
    },
    requestId: req.headers['x-request-id'],
    path: req.path,
    method: req.method,
    statusCode: status,
  }, 'Request error');

  res.status(status).json({
    error: {
      type: (err as AppError).type || 'INTERNAL_ERROR',
      message,
      requestId: req.headers['x-request-id'],
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
};

export default errorHandler;
