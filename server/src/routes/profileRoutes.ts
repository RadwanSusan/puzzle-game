// src/routes/profileRoutes.ts
import express from 'express';
import { authMiddleware } from '../middleware/auth';
import {
	getProfile,
	updateProfile,
	getStatistics,
} from '../controllers/profileController';
const router = express.Router();
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/statistics', authMiddleware, getStatistics);
export default router;
