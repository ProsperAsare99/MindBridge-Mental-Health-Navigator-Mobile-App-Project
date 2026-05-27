import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getGroups = async (req: Request, res: Response) => {
  try {
    const groups = await prisma.supportGroup.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(groups);
  } catch (error) {
    console.warn('Database unreachable. Returning mock support groups.');
    const mockGroups = [
      { id: '1', name: 'Final Year Stress', description: 'A safe space to discuss the pressures of final year projects, exams, and post-grad life.', color: '#9EB4CC', members: 1200 },
      { id: '2', name: 'Anxiety Support', description: 'Share coping strategies, mindfulness techniques, and general support for anxiety.', color: '#C49E9E', members: 3400 },
      { id: '3', name: 'Meditation Group', description: 'Daily mindful breathing techniques and meditation practices.', color: '#C2D8C4', members: 850 },
      { id: '4', name: 'International Students', description: 'Navigating culture shock, homesickness, and studying abroad.', color: '#E8B49A', members: 500 },
      { id: '5', name: 'ADHD / Neurodivergent', description: 'Study hacks, productivity tips, and mutual support for neurodivergent minds.', color: '#A0A4C0', members: 950 }
    ];
    res.json(mockGroups);
  }
};

export const seedGroups = async (req: Request, res: Response) => {
  try {
    const defaultGroups = [
      { name: 'Final Year Stress', description: 'A safe space to discuss the pressures of final year projects, exams, and post-grad life.', color: '#9EB4CC', members: 1200 },
      { name: 'Anxiety Support', description: 'Share coping strategies, mindfulness techniques, and general support for anxiety.', color: '#C49E9E', members: 3400 },
      { name: 'Meditation Group', description: 'Daily mindful breathing techniques and meditation practices.', color: '#C2D8C4', members: 850 },
      { name: 'International Students', description: 'Navigating culture shock, homesickness, and studying abroad.', color: '#E8B49A', members: 500 },
      { name: 'ADHD / Neurodivergent', description: 'Study hacks, productivity tips, and mutual support for neurodivergent minds.', color: '#A0A4C0', members: 950 }
    ];

    const created = await Promise.all(
      defaultGroups.map(g => prisma.supportGroup.create({ data: g }))
    );

    res.status(201).json(created);
  } catch (error) {
    console.error('Error seeding support groups:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
