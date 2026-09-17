import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbFindUserByEmail, dbCreateUser, dbUpdateUser, dbFindUserById } from '../services/dbService.js';
import { AuthRequest } from '../middleware/auth.js';
import { getDBStatus } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow_jwt_college_secret_key_2025';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (id: string, email: string): string => {
  return jwt.sign({ id, email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password',
      });
      return;
    }

    if (name.trim().length < 2) {
      res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long',
      });
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
      return;
    }

    const existingUser = await dbFindUserByEmail(email);
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await dbCreateUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    const userId = (user as any)._id?.toString() || (user as any).id;
    const token = generateToken(userId, user.email);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: (user as any).role || 'user',
        createdAt: (user as any).createdAt,
      },
      token,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during registration',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
      return;
    }

    const user = await dbFindUserByEmail(email);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, (user as any).password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    const userId = (user as any)._id?.toString() || (user as any).id;
    const token = generateToken(userId, user.email);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: (user as any).role || 'user',
        createdAt: (user as any).createdAt,
      },
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during login',
    });
  }
};

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const user = await dbFindUserById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      user,
      dbStatus: getDBStatus(),
    });
  } catch (error: any) {
    console.error('getMe error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving user' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { name, email, currentPassword, newPassword } = req.body;
    const updates: any = {};

    if (name && name.trim().length >= 2) {
      updates.name = name.trim();
    }

    if (email && email.trim() !== req.user.email) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ success: false, message: 'Invalid email address' });
        return;
      }
      const existing = await dbFindUserByEmail(email);
      if (existing) {
        res.status(409).json({ success: false, message: 'Email address already in use' });
        return;
      }
      updates.email = email.trim().toLowerCase();
    }

    // Password change
    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({
          success: false,
          message: 'Current password is required to set a new password',
        });
        return;
      }
      if (newPassword.length < 6) {
        res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters',
        });
        return;
      }

      // Check current password
      const fullUser = await dbFindUserByEmail(req.user.email);
      if (!fullUser) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      const isMatch = await bcrypt.compare(currentPassword, (fullUser as any).password);
      if (!isMatch) {
        res.status(400).json({ success: false, message: 'Current password is incorrect' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(newPassword, salt);
    }

    const updatedUser = await dbUpdateUser(req.user.id, updates);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

// @desc    Logout (Client token invalidation acknowledgement)
// @route   POST /api/auth/logout
// @access  Public
export const logout = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
