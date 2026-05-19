import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const getResources = async (req, res) => {
    try {
        let resources = await prisma.resource.findMany({
            orderBy: { createdAt: 'desc' },
        });
        if (resources.length === 0) {
            // Auto-seed real data
            await prisma.resource.createMany({
                data: [
                    { title: 'The Body Keeps the Score (Summary)', author: 'Bessel van der Kolk', type: 'PDF Guide', color: '#5F8D7B' },
                    { title: 'Atomic Habits for Students', author: 'James Clear', type: 'Free Guide', color: '#7EA8BE' },
                    { title: 'MindBridge Anxiety Workbook', author: 'Clinical Team', type: 'Workbook', color: '#C49799' },
                    { title: 'How to Manage Stress as a Student', author: 'Thomas Frank', duration: '12:45', type: 'Video', color: '#5C6B73' },
                    { title: 'A 10-Minute Meditation for Anxiety', author: 'Goodful', duration: '10:20', type: 'Video', color: '#C49799' },
                    { title: 'The Neuroscience of Sleep', author: 'Huberman Lab', duration: '18:30', type: 'Video', color: '#3B5249' },
                    { title: 'Understanding Academic Burnout', category: 'Stress', duration: '4 min read', type: 'Article' },
                    { title: 'The Science of Deep Breathing', category: 'Science', duration: '3 min read', type: 'Article' },
                    { title: 'Navigating Social Anxiety on Campus', category: 'Anxiety', duration: '6 min read', type: 'Article' },
                ]
            });
            resources = await prisma.resource.findMany({ orderBy: { createdAt: 'desc' } });
        }
        // Group them for easy frontend consumption
        const grouped = {
            audio: resources.filter(r => r.type === 'Audio'),
            articles: resources.filter(r => r.type === 'Article'),
            videos: resources.filter(r => r.type === 'Video'),
            books: resources.filter(r => r.type === 'Book' || r.type.includes('PDF')),
            tools: resources.filter(r => r.type === 'Tool'),
        };
        res.json(grouped);
    }
    catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
//# sourceMappingURL=resources.controller.js.map