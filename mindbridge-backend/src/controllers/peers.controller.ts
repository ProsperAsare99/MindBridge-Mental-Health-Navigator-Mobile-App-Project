import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPeers = async (req: Request, res: Response) => {
  try {
    const peers = await prisma.peerSupportProfile.findMany({
      include: {
        user: {
          select: {
            name: true,
            profileImage: true,
            studentId: true,
          }
        }
      },
      orderBy: { rating: 'desc' }
    });
    
    res.json(peers);
  } catch (error) {
    console.warn('Database unreachable. Returning mock peer supporters.');
    const mockPeers = [
      {
        id: 'p1',
        userId: 'u1',
        bio: 'Hi, I am Ama. I am a final year psychology student. I know how overwhelming balancing academics with family obligations can be. I am here if you need someone to vent to.',
        specialties: ['Academic Stress', 'Family Obligations', 'Time Management'],
        isAvailable: true,
        rating: 4.9,
        user: {
          name: 'Ama Osei',
          profileImage: null,
          studentId: '1092XXXX'
        }
      },
      {
        id: 'p2',
        userId: 'u2',
        bio: 'Hello! I am Emmanuel. I navigated severe burnout during my second year when I was trying to run a side-hustle while studying. I can help you build better boundaries and routines.',
        specialties: ['Burnout', 'Work-Life Balance', 'Student Entrepreneurship'],
        isAvailable: true,
        rating: 5.0,
        user: {
          name: 'Emmanuel Boakye',
          profileImage: null,
          studentId: '1088XXXX'
        }
      },
      {
        id: 'p3',
        userId: 'u3',
        bio: 'I understand the intense pressure of family expectations and navigating financial stress on campus. I am a trained peer listener, here to offer practical advice and a listening ear.',
        specialties: ['Financial Stress', 'Family Expectations', 'Faith Crisis'],
        isAvailable: false,
        rating: 4.8,
        user: {
          name: 'Kwame A.',
          profileImage: null,
          studentId: '1095XXXX'
        }
      },
      {
        id: 'p4',
        userId: 'u4',
        bio: 'Hey, I am Abena. Moving from the village to a big university in the city was a huge culture shock for me. If you are feeling homesick or struggling to fit in, let us talk.',
        specialties: ['Homesickness', 'Culture Shock', 'Social Anxiety'],
        isAvailable: true,
        rating: 4.9,
        user: {
          name: 'Abena Appiah',
          profileImage: null,
          studentId: '1098XXXX'
        }
      }
    ];
    res.json(mockPeers);
  }
};

export const seedPeers = async (req: Request, res: Response) => {
  try {
    // Check if we have at least one user to attach to
    const user = await prisma.user.findFirst();
    
    if (!user) {
      return res.status(400).json({ error: 'No user found to associate peer profiles with. Please create a user first.' });
    }

    const defaultPeers = [
      {
        userId: user.id,
        bio: 'Hi, I am a trained peer listener specializing in academic stress and time management. Feel free to reach out!',
        specialties: ['Academic Stress', 'Time Management', 'General Anxiety'],
        isAvailable: true,
        rating: 4.9
      }
    ];

    // Delete existing to avoid unique constraint error on userId
    await prisma.peerSupportProfile.deleteMany({});

    const created = await Promise.all(
      defaultPeers.map(p => prisma.peerSupportProfile.create({ data: p }))
    );

    res.status(201).json(created);
  } catch (error) {
    console.error('Error seeding peers:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
