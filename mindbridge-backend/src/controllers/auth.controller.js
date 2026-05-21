import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const register = async (req, res) => {
    try {
        const { email, password, name, studentId, username, phoneNumber } = req.body;
        console.log('[AUTH] Registration attempt for:', email, username);
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    ...(username ? [{ username }] : [])
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
        const userWithOnboarding = await prisma.user.findUnique({
            where: { id: user.id },
            include: { onboarding: true }
        });
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('[CRITICAL] JWT_SECRET environment variable is missing.');
            return res.status(500).json({ error: 'Internal server configuration error' });
        }
        const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });
        res.status(201).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                isOnboarded: !!userWithOnboarding?.onboarding
            },
            token
        });
    }
    catch (error) {
        console.error('Registration Error Details:', error);
        if (error instanceof Error) {
            console.error('Stack:', error.stack);
        }
        res.status(500).json({ error: 'Server error' });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email },
            include: { onboarding: true }
        });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ error: 'Invalid credentials' });
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('[CRITICAL] JWT_SECRET environment variable is missing.');
            return res.status(500).json({ error: 'Internal server configuration error' });
        }
        const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });
        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                isOnboarded: !!user?.onboarding
            },
            token
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
export const getMe = async (req, res) => {
    try {
        if (!req.userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            include: { onboarding: true }
        });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                studentId: user.studentId,
                isOnboarded: !!user?.onboarding
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!req.userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const user = await prisma.user.findUnique({ where: { id: req.userId } });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ error: 'Current password incorrect' });
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: req.userId },
            data: { password: hashedPassword }
        });
        res.status(200).json({ message: 'Password updated successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
//# sourceMappingURL=auth.controller.js.map