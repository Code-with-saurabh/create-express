import pinoHttp from 'pino-http';
import { logger } from '../config/logger';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req: Request) => (req.headers['x-request-id'] as string) || randomUUID(),
  customLogLevel: (req: Request, res: Response, err?: Error) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  autoLogging: {
    ignore: (req: Request) => req.url === '/api/health' || req.url === '/api/health/live',
  },
  serializers: {
    req: (req: Request) => ({
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
    }),
    res: (res: Response) => ({
      statusCode: res.statusCode,
    }),
  },
});

export default requestLogger;
