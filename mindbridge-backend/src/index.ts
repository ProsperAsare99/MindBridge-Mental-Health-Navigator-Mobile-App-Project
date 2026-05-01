import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth.routes.js';
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('MindBridge API is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
