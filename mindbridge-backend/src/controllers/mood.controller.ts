import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMoodLogs = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const logs = await prisma.moodLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30, // Last 30 days
    });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching mood logs:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createMoodLog = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { score, emotions, note } = req.body;
    
    if (score === undefined || !emotions) {
      return res.status(400).json({ error: 'Score and emotions are required' });
    }

    const newLog = await prisma.moodLog.create({
      data: {
        userId,
        score,
        emotions,
        note,
      },
    });

    res.status(201).json(newLog);
  } catch (error) {
    console.error('Error creating mood log:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
