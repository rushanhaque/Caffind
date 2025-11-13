import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JwtPayload {
  id: string;
  email: string;
}

export const generateToken = (user: IUser): string => {
  const payload: JwtPayload = {
    id: (user._id as any).toString(),
    email: user.email
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export const getUserFromToken = (req: NextRequest): JwtPayload | null => {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  return verifyToken(token);
};