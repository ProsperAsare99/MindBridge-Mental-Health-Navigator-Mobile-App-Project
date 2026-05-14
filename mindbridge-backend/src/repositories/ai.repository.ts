import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AiRepository {
  /**
   * Fetches the user's recent mood logs.
   */
  static async getMoodHistory(userId: string, limit: number = 5) {
    return await prisma.moodLog.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        score: true,
        emotions: true,
        note: true,
        createdAt: true,
      }
    });
  }

  /**
   * Fetches the user's recent journal entries.
   */
  static async getJournalHistory(userId: string, limit: number = 3) {
    return await prisma.journal.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        title: true,
        content: true,
        mood: true,
        createdAt: true,
      }
    });
  }

  /**
   * Checks the completion status of today's rituals.
   */
  static async getTodayRitualStatus(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const moodLogged = await prisma.moodLog.findFirst({
      where: {
        userId,
        createdAt: { gte: today }
      }
    });

    const journalLogged = await prisma.journal.findFirst({
      where: {
        userId,
        createdAt: { gte: today }
      }
    });

    // Note: Breathing status is handled on the frontend via AsyncStorage in the current architecture,
    // but we can acknowledge backend-tracked rituals here.
    return {
      moodGarden: !!moodLogged,
      journalEntry: !!journalLogged,
      // We could add a Ritual model later for unified tracking
    };
  }
}
