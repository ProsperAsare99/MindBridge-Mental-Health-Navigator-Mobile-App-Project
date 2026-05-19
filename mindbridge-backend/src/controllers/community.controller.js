import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const getFeed = async (req, res) => {
    try {
        const posts = await prisma.communityPost.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50, // Limit to recent 50 posts for performance
            include: {
                user: {
                    select: {
                        id: true,
                        // Keep it anonymous but maybe expose a generated avatar color or generic profile info if needed
                    }
                }
            }
        });
        res.json(posts);
    }
    catch (error) {
        console.error('Error fetching community feed:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
export const createPost = async (req, res) => {
    try {
        const userId = req.userId;
        const { content, group } = req.body;
        if (!content || !group) {
            return res.status(400).json({ error: 'Content and group are required' });
        }
        const newPost = await prisma.communityPost.create({
            data: {
                userId,
                group,
                content,
            },
        });
        res.status(201).json(newPost);
    }
    catch (error) {
        console.error('Error creating community post:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
export const sendHug = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await prisma.communityPost.update({
            where: { id: postId },
            data: {
                hugs: { increment: 1 }
            }
        });
        res.json(post);
    }
    catch (error) {
        console.error('Error sending hug:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
//# sourceMappingURL=community.controller.js.map