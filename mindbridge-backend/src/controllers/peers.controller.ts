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
        bio: 'Hi, I am a trained peer listener specializing in academic stress and time management. Feel free to reach out!',
        specialties: ['Academic Stress', 'Time Management', 'General Anxiety'],
        isAvailable: true,
        rating: 4.9,
        user: {
          name: 'Sarah J.',
          profileImage: null,
          studentId: '1092XXXX'
        }
      },
      {
        id: 'p2',
        userId: 'u2',
        bio: 'I went through severe burnout last year and learned a lot about setting boundaries. Happy to chat and share my experience.',
        specialties: ['Burnout', 'Work-Life Balance', 'Depression'],
        isAvailable: true,
        rating: 5.0,
        user: {
          name: 'Michael T.',
          profileImage: null,
          studentId: '1088XXXX'
        }
      },
      {
        id: 'p3',
        userId: 'u3',
        bio: 'Safe space for LGBTQ+ students. I am here to listen without judgment.',
        specialties: ['LGBTQ+ Issues', 'Identity', 'Family Conflict'],
        isAvailable: false,
        rating: 4.8,
        user: {
          name: 'Alex R.',
          profileImage: null,
          studentId: '1095XXXX'
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
