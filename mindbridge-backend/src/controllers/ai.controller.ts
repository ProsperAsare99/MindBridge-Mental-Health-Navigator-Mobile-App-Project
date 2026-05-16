import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateOracleResponse } from '../services/gemini.service.js';
import { AiRepository } from '../repositories/ai.repository.js';

const prisma = new PrismaClient();

// High-risk keywords for safety screening
const CRISIS_KEYWORDS = [
  'suicide', 'self-harm', 'kill myself', 'end my life', 'better off dead',
  'hurt myself', 'cutting', 'overdose', 'hopeless', 'no reason to live'
];

export const getOracleContext = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    // Get latest mood log
    const latestMood = await prisma.moodLog.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Get user name for fallback personalization
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
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

    // Get onboarding data for personality matching
    const onboarding = await prisma.onboarding.findUnique({
      where: { userId }
    });

    // Get recent chat history
    const history = await AiRepository.getChatHistory(userId, 15);

    // Get clinical assessments
    const assessments = await AiRepository.getLatestAssessments(userId);

    // Get latest community post for dashboard snapshot
    const latestCommunityPost = await prisma.communityPost.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      latestMood: latestMood || null,
      recentJournal: recentJournal || [],
      onboarding: onboarding || null,
      userName: user?.name || 'Friend',
      history: history || [],
      assessments: assessments || [],
      latestCommunityPost: latestCommunityPost || null,
      dbStatus: 'online'
    });
  } catch (error: any) {
    console.error('Error fetching Oracle context:', error);
    
    // If it's a connection error (P1001), return empty context instead of 500
    if (error.code === 'P1001' || error.message.includes('Can\'t reach database server')) {
      return res.json({
        latestMood: null,
        recentJournal: [],
        onboarding: null,
        dbStatus: 'offline',
        warning: 'Database is momentarily sleeping. Please try again in a few seconds.'
      });
    }

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

    // 1. Safety Screening (Pre-LLM)
    const lowerInput = message.toLowerCase();
    const isCrisis = CRISIS_KEYWORDS.some(kw => lowerInput.includes(kw));

    if (isCrisis) {
      return res.json({
        response: "I'm hearing a lot of pain in your words, and I'm very concerned about you. You don't have to carry this alone. Please reach out to one of the professionals on our Crisis Support page immediately — they are ready to help right now.",
        suggestCrisis: true
      });
    }

    // 2. Fetch Context
    const latestMood = await prisma.moodLog.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const recentJournal = await prisma.journal.findMany({
      where: { userId },
      take: 3,
      orderBy: { createdAt: 'desc' },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
    });

    const onboarding = await prisma.onboarding.findUnique({
      where: { userId }
    });

    const history = await AiRepository.getChatHistory(userId, 10);
    const assessments = await AiRepository.getLatestAssessments(userId);

    // 3. Save User Message
    await prisma.chatMessage.create({
      data: { userId, role: 'user', content: message }
    });

    // 4. Generate AI Response
    const aiResponse = await generateOracleResponse(message, {
      latestMood,
      recentJournal,
      onboarding,
      userName: user?.name || 'Friend',
      history,
      assessments
    }, userId);

    // 5. Save AI Response
    await prisma.chatMessage.create({
      data: { userId, role: 'model', content: aiResponse }
    });

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in Oracle chat:', error);
    res.status(500).json({ error: 'I am momentarily resting my thoughts. Please try talking to me again in a moment.' });
  }
};

export const clearChatHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    await AiRepository.clearChatHistory(userId);
    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
};

