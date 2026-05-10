import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getOracleContext = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    // Get latest mood log
    const latestMood = await prisma.moodLog.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Get 3 most recent journal entries
    const recentJournal = await prisma.journal.findMany({
      where: { userId },
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        title: true,
        content: true,
        mood: true,
        createdAt: true,
      }
    });

    res.json({
      latestMood,
      recentJournal,
    });
  } catch (error) {
    console.error('Error fetching Oracle context:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
