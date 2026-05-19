import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class AiRepository {
    /**
     * Fetches the user's recent mood logs.
     */
    static async getMoodHistory(userId, limit = 5) {
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
    static async getJournalHistory(userId, limit = 3) {
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
    static async getTodayRitualStatus(userId) {
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
    /**
     * Fetches the last N chat messages for context.
     */
    static async getChatHistory(userId, limit = 10) {
        return await prisma.chatMessage.findMany({
            where: { userId },
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                role: true,
                content: true,
                createdAt: true,
            }
        });
    }
    static async deleteChatMessage(userId, messageId) {
        return await prisma.chatMessage.delete({
            where: { id: messageId, userId }
        });
    }
    /**
     * Deletes multiple chat messages in bulk.
     */
    static async deleteChatMessages(userId, messageIds) {
        return await prisma.chatMessage.deleteMany({
            where: { id: { in: messageIds }, userId }
        });
    }
    /**
     * Clears all chat messages for a user.
     */
    static async clearChatHistory(userId) {
        return await prisma.chatMessage.deleteMany({
            where: { userId }
        });
    }
    /**
     * Fetches the latest assessment results for clinical context.
     */
    static async getLatestAssessments(userId) {
        return await prisma.assessmentResult.findMany({
            where: { userId },
            take: 5,
            orderBy: { createdAt: 'desc' },
        });
    }
    /**
     * Searches for resources by category or keyword.
     */
    static async searchResources(category) {
        return await prisma.resource.findMany({
            where: category ? { category: { contains: category, mode: 'insensitive' } } : {},
            take: 3,
        });
    }
}
//# sourceMappingURL=ai.repository.js.map