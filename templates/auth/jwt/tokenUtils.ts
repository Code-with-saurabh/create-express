import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): jwt.JwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
};

export const verifyRefreshToken = (token: string): jwt.JwtPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as jwt.JwtPayload;
};

export default { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
