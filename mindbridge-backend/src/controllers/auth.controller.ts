import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, studentId, username, phoneNumber } = req.body as {
      email: string;
      password: string;
      name: string;
      studentId?: string;
      username?: string;
      phoneNumber?: string;
    };

    console.log('[AUTH] Registration attempt for:', email, username);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username: username || null }
        ]
      }
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return res.status(400).json({ error: `${field} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword, 
        name, 
        username: username || null,
        phoneNumber: phoneNumber || null,
        ...(studentId ? { studentId } : {}) 
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, username: user.username }, token });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
    res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, username: user.username }, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: req.userId }, // now guaranteed to be string, not string | undefined
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, username: user.username, studentId: user.studentId } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!req.userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Current password incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword }
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
