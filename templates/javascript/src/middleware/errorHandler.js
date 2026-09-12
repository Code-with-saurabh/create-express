const { logger } = require('../config/logger');

const errorHandler = (err, req, res, _next) => {
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' && status === 500
    ? 'An unexpected error occurred'
    : err.message;

  logger.error({
    err: {
      message: err.message,
      stack: err.stack,
      type: err.type || 'INTERNAL_ERROR',
    },
    requestId: req.headers['x-request-id'],
    path: req.path,
    method: req.method,
    statusCode: status,
  }, 'Request error');

  res.status(status).json({
    error: {
      type: err.type || 'INTERNAL_ERROR',
      message,
      requestId: req.headers['x-request-id'],
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
};

module.exports = { errorHandler };
