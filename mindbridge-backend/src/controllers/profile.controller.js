import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                onboarding: true
            }
        });
        if (!user) {
            return res.status(401).json({ error: 'User not found. Session invalid.', code: 'USER_NOT_FOUND' });
        }
        // Don't send password
        const { password, ...userProfile } = user;
        // Calculate Stats
        const moodLogs = await prisma.moodLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        const journals = await prisma.journal.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        // Simple Streak Logic
        let streak = 0;
        const today = new Date().toDateString();
        const uniqueDays = new Set([...moodLogs, ...journals].map(l => new Date(l.createdAt).toDateString()));
        const sortedDays = Array.from(uniqueDays).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        if (sortedDays.includes(today)) {
            streak = 1;
            for (let i = 0; i < sortedDays.length - 1; i++) {
                const d1Str = sortedDays[i];
                const d2Str = sortedDays[i + 1];
                const d1 = new Date(d1Str);
                const d2 = new Date(d2Str);
                const diff = (d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24);
                if (diff === 1)
                    streak++;
                else
                    break;
            }
        }
        // Simple Points Logic: 100 per mood, 200 per journal
        const points = (moodLogs.length * 100) + (journals.length * 200);
        // 7 Day Mood Trend
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dayStr = d.toDateString();
            const dayLogs = moodLogs.filter(l => new Date(l.createdAt).toDateString() === dayStr);
            const avgScore = dayLogs.length > 0 ? dayLogs.reduce((acc, curr) => acc + curr.score, 0) / dayLogs.length : 0;
            return { day: d.toLocaleDateString('en-US', { weekday: 'narrow' }), score: avgScore };
        });
        res.json({
            ...userProfile,
            stats: {
                streak,
                points,
                seeds: journals.length,
                badges: Math.floor(points / 500),
                trend: last7Days
            }
        });
    }
    catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, username, phoneNumber, profileImage, studentId, university, program, level } = req.body;
        // Update User table
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                username,
                phoneNumber,
                profileImage,
                studentId,
            },
        });
        // Update Onboarding table if university/program/level provided
        if (university || program || level) {
            await prisma.onboarding.update({
                where: { userId },
                data: {
                    university,
                    program,
                    level,
                },
            });
        }
        res.json({ message: 'Profile updated successfully', user: updatedUser });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
//# sourceMappingURL=profile.controller.js.map