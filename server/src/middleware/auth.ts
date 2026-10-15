import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export const DEMO_USER_ID = new mongoose.Types.ObjectId('666666666666666666666666').toString();
export const DEMO_USER = {
  id: DEMO_USER_ID,
  email: 'demo@freecvstudio.local',
  role: 'demo',
};

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer demo-token-access')) {
    req.user = DEMO_USER;
    return next();
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication required. Please log in.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'freecv_studio_super_secret_jwt_key_2026_unlimited_free';
    const decoded = jwt.verify(token, secret) as { id: string; email: string; role?: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired session. Please log in again.' });
  }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer demo-token-access')) {
    req.user = DEMO_USER;
    return next();
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const secret = process.env.JWT_SECRET || 'freecv_studio_super_secret_jwt_key_2026_unlimited_free';
      const decoded = jwt.verify(token, secret) as { id: string; email: string; role?: string };
      req.user = decoded;
    } catch {
      // Ignore if optional
    }
  }
  next();
};
