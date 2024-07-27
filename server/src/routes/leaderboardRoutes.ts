import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { getDailyLeaderboard } from '../controllers/leaderboardController';
const router = express.Router();
router.get('/daily', authMiddleware, getDailyLeaderboard);
