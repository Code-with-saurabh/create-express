import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler';
import { loginLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';
import { ValidationError, UnauthorizedError } from '../errors/AppError';

const router = Router();

const generateTokens = (userId: string, email: string, role?: string) => {
  const accessToken = jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, email, role },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ValidationError('Name, email and password are required');
  }

  const User = (await import('../models/User')).default;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ValidationError('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });

  const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.email, user.role);

  res.status(201).json({
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    },
  });
}));

router.post('/login', loginLimiter, asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const User = (await import('../models/User')).default;
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.email, user.role);

  res.json({
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    },
  });
}));

router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ValidationError('Refresh token required');
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as jwt.JwtPayload;
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      decoded.userId,
      decoded.email,
      decoded.role
    );

    res.json({ data: { accessToken, refreshToken: newRefreshToken } });
  } catch (error) {
    throw new UnauthorizedError('Invalid refresh token');
  }
}));

router.get('/me', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const User = (await import('../models/User')).default;
  const user = await User.findById(req.userId);

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  res.json({ data: { user } });
}));

export default router;
