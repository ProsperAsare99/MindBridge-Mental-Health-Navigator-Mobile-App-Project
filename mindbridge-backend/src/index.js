import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import journalRoutes from './routes/journal.routes.js';
import communityRoutes from './routes/community.routes.js';
import moodRoutes from './routes/mood.routes.js';
import resourcesRoutes from './routes/resources.routes.js';
import aiRoutes from './routes/ai.routes.js';
import onboardingRoutes from './routes/onboarding.routes.js';
import profileRoutes from './routes/profile.routes.js';
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use((req, res, next) => {
    console.log(`[BACKEND] ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/profile', profileRoutes);
app.get('/', (req, res) => {
    res.send('MindBridge API is running');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map