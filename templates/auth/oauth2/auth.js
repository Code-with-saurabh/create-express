const { UnauthorizedError } = require('../errors/AppError');

const authenticate = (req, res, next) => {
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

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new UnauthorizedError('Insufficient permissions'));
    }
    next();
  };
};

module.exports = { authenticate, authorize };
