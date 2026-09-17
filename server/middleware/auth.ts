import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbFindUserById } from '../services/dbService.js';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow_jwt_college_secret_key_2025';

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access denied. Please log in to proceed.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const user = await dbFindUserById(decoded.id);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'The user account associated with this token no longer exists.',
      });
      return;
    }

    const userId = (user as any)._id?.toString() || (user as any).id;
    req.user = {
      _id: userId,
      id: userId,
      name: (user as any).name,
      email: (user as any).email,
      role: (user as any).role || 'user',
    };

    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication session. Please log in again.',
    });
  }
};
