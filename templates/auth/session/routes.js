const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { asyncHandler } = require('../utils/asyncHandler');
const { loginLimiter } = require('../middleware/rateLimiter');
const { authenticate } = require('../middleware/auth');
const { ValidationError, UnauthorizedError } = require('../errors/AppError');

const router = Router();

router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ValidationError('Name, email and password are required');
  }

  const User = require('../models/User');
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ValidationError('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });

  req.session.userId = user._id;
  req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };

  res.status(201).json({
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    },
  });
}));

router.post('/login', loginLimiter, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const User = require('../models/User');
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  req.session.userId = user._id;
  req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };

  res.json({
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    },
  });
}));

router.post('/logout', authenticate, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: { message: 'Failed to logout' } });
    }
    res.clearCookie('connect.sid');
    res.json({ data: { message: 'Logged out successfully' } });
  });
});

router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const User = require('../models/User');
  const user = await User.findById(req.userId);

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  res.json({ data: { user } });
}));

module.exports = router;
