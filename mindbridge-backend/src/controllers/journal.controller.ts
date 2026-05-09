import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getEntries = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const entries = await prisma.journal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createEntry = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { title, content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const newEntry = await prisma.journal.create({
      data: {
        userId,
        title,
        content,
      },
    });

    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
