const { NotFoundError } = require('./AppError');

const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.path}`));
};

module.exports = { notFoundHandler };
