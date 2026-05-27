import { Router } from 'express';
import { getPeers, seedPeers } from '../controllers/peers.controller.js';

const router = Router();

// Routes
router.get('/', getPeers);
router.post('/seed', seedPeers);

export default router;
