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

export const chatWithOracle = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get context for deeper analysis
    const latestMood = await prisma.moodLog.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const recentJournal = await prisma.journal.findMany({
      where: { userId },
      take: 2,
      orderBy: { createdAt: 'desc' },
    });

    // Rule-based engine (Preparation for LLM integration)
    let response = "I'm listening closely. Your feelings are valid, and I'm here to support you in whatever way you need right now.";
    const lowerInput = message.toLowerCase();

    // Context-aware logic
    if (lowerInput.includes('help') || lowerInput.includes('anxious') || lowerInput.includes('panic')) {
      response = "I can feel the weight of those thoughts. Would you like to try a 4-7-8 breathing exercise together? It often helps settle the Oracle's energy and yours.";
    } else if (lowerInput.includes('journal') || lowerInput.includes('write')) {
      response = "Writing things down is a powerful release. Your recent journal entries show a lot of strength and self-awareness. What else is on your mind?";
    } else if (latestMood && (lowerInput.includes('mood') || lowerInput.includes('feeling') || lowerInput.includes('garden'))) {
       const emotions = latestMood.emotions.join(', ').toLowerCase();
       response = `I remember your last garden seed reflected feeling ${emotions}. It's brave of you to keep exploring these feelings. How are you doing in this moment?`;
    } else if (recentJournal.length > 0 && lowerInput.includes('reflect')) {
      response = "Reflection is the key to growth. Looking at your recent thoughts, I see a pattern of resilience. What's one thing you're proud of today?";
    }

    res.json({ response });
  } catch (error) {
    console.error('Error in Oracle chat:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
