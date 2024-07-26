// src\routes\puzzleRoutes.ts
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import {
	checkPuzzle,
	getHint,
	getWordSearchPuzzle,
	getPuzzle,
	submitScore,
	getLeaderboard,
} from '../controllers/puzzleController';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { getDailyChallenge } from '../services/dailyChallengeService';
const router = express.Router();
router.get(
	'/puzzle',
	query('difficulty').isIn(['easy', 'medium', 'hard']),
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	getPuzzle,
);
router.post(
	'/score',
	authMiddleware,
	[
		body('score').isInt({ min: 0 }),
		body('difficulty').isIn(['easy', 'medium', 'hard']),
		body('solution').isArray(),
	],
	(req: AuthRequest, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	submitScore,
);
router.post(
	'/check',
	authMiddleware,
	[body('puzzleId').exists(), body('solution').isArray()],
	(req: AuthRequest, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	checkPuzzle,
);
router.post(
	'/hint',
	authMiddleware,
	[
		body('puzzleId').exists(),
		body('puzzleType').isIn(['number', 'wordsearch', 'crossword']),
		body('userSolution').isArray(),
	],
	(req: AuthRequest, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	getHint,
);
router.get('/leaderboard', getLeaderboard);
router.get('/wordsearch', authMiddleware, getWordSearchPuzzle);
router.post('/hint', authMiddleware, getHint);
router.get('/daily', authMiddleware, getDailyChallenge);
export default router;
