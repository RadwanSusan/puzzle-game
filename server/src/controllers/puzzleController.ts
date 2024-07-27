// src\controllers\puzzleController.ts
import { Request, Response } from 'express';
import Puzzle, { IPuzzle } from '../models/Puzzle';
import Score from '../models/Score';
import User from '../models/User';
import { validatePuzzleSolution } from '../services/puzzleValidationService';
import { updateUserProgress } from '../services/progressionService';
import { checkAchievements } from '../services/rewardService';
import { updateStatistics } from '../services/statisticsService';
import { AuthRequest } from '../middleware/auth';
import {
	getCrosswordHint,
	getNumberPuzzleHint,
	getWordSearchHint,
} from '../services/hintService';
import { generateWordSearch } from '../services/wordSearchService';
import { generateNumberPuzzle } from '../services/numberPuzzleService';
import { generateCrossword } from '../services/crosswordGenerator';
export async function getPuzzle(req: Request, res: Response) {
	try {
		const difficulty = req.query.difficulty as 'easy' | 'medium' | 'hard';
		const gameType = req.query.type as 'number' | 'wordsearch' | 'crossword';
		let puzzle: any;
		switch (gameType) {
			case 'wordsearch':
				const wordCount =
					difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12;
				const gridSize =
					difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
				puzzle = await generateWordSearch(wordCount, gridSize);
				res.json({
					id: puzzle.id,
					grid: puzzle.grid,
					words: puzzle.words,
					difficulty: difficulty,
					gameType: gameType,
				});
				break;
			case 'number':
				puzzle = await generateNumberPuzzle(difficulty);
				res.json({
					id: puzzle._id,
					grid: puzzle.grid,
					solution: puzzle.solution,
					difficulty: difficulty,
					gameType: gameType,
				});
				break;
			case 'crossword':
				puzzle = await generateCrossword();
				res.json({
					id: puzzle._id,
					grid: puzzle.grid,
					clues: puzzle.clues,
					difficulty: difficulty,
					gameType: gameType,
				});
				break;
			default:
				return res.status(400).json({ message: 'Invalid game type' });
		}
	} catch (error) {
		res.status(500).json({ message: `Error generating puzzle: ${error}` });
	}
}
export async function submitScore(req: AuthRequest, res: Response) {
	try {
		console.log(req.body);
		const { score, difficulty, puzzleId, puzzleType, time, isDaily } =
			req.body;
		const username = req.user?.username;
		if (!username) {
			return res.status(401).json({ message: 'User not authenticated' });
		}
		const puzzle = await Puzzle.findById(puzzleId);
		if (!puzzle) {
			return res.status(404).json({ message: 'Puzzle not found' });
		}
		const newScore = new Score({
			username,
			score,
			difficulty,
			puzzleType,
			time,
		});
		await newScore.save();
		if (!req.user) {
			return res.status(401).json({ message: 'User not authenticated' });
		}
		const newDifficulty = await updateUserProgress(req.user.id, {
			score,
			difficulty,
			puzzleType,
			time: 0,
		});
		await updateStatistics(req.user.id, puzzleType, time, isDaily);
		const newAchievements = await checkAchievements(req.user.id);
		const updatedStats = await getUserStats(req.user.id);
		res.status(201).json({
			message: 'Score submitted successfully',
			score: newScore,
			newDifficulty,
			newAchievements,
			updatedStats,
		});
	} catch (error) {
		console.error('Error submitting score:', error);
		res.status(500).json({ message: `Error submitting score ${error}` });
	}
}
async function getUserStats(userId: string) {
	const user = await User.findById(userId).select('statistics');
	return user?.statistics;
}
export async function getLeaderboard(req: AuthRequest, res: Response) {
	try {
		const { puzzleType, difficulty } = req.query;
		const leaderboard = await Score.find({ puzzleType, difficulty })
			.sort({ score: -1 })
			.limit(10)
			.select('username score timestamp');
		res.json(leaderboard);
	} catch (error) {
		console.error('Error retrieving leaderboard:', error);
		res.status(500).json({ message: 'Error retrieving leaderboard' });
	}
}
export async function checkPuzzle(req: AuthRequest, res: Response) {
	try {
		const { puzzleId, solution } = req.body;
		const puzzle = await Puzzle.findById(puzzleId);
		if (!puzzle || !puzzle.solution) {
			return res
				.status(404)
				.json({ message: 'Puzzle not found or invalid' });
		}
		const errors: [number, number][] = [];
		for (let i = 0; i < puzzle.solution.length; i++) {
			for (let j = 0; j < puzzle.solution[i].length; j++) {
				if (solution[i][j] !== puzzle.solution[i][j]) {
					errors.push([i, j]);
				}
			}
		}
		res.json({ errors });
	} catch (error) {
		res.status(500).json({ message: 'Error checking puzzle' });
	}
}
export async function getHint(req: AuthRequest, res: Response) {
	try {
		const { puzzleId, puzzleType, userSolution } = req.body;
		let hint;
		if (puzzleType === 'number') {
			hint = await getNumberPuzzleHint(puzzleId, userSolution);
		} else if (puzzleType === 'wordsearch') {
			hint = await getWordSearchHint(puzzleId, userSolution);
		} else if (puzzleType === 'crossword') {
			hint = await getCrosswordHint(puzzleId, userSolution);
		}
		if (!hint) {
			return res.status(404).json({ message: 'No hint available' });
		}
		res.json({ hint });
	} catch (error) {
		console.error('Error getting hint:', error);
		res.status(500).json({ message: 'Error getting hint' });
	}
}
// export async function getWordSearchPuzzle(req: AuthRequest, res: Response) {
// 	try {
// 		const words = ['PUZZLE', 'GAME', 'WORD', 'SEARCH', 'FUN'];
// 		const { grid, words: placedWords } = generateWordSearch(words);
// 		const puzzle = new Puzzle({
// 			type: 'wordsearch',
// 			grid,
// 			solution: placedWords,
// 			difficulty: 'medium',
// 		});
// 		await puzzle.save();
// 		res.json({ id: puzzle._id, grid, words: placedWords });
// 	} catch (error) {
// 		res.status(500).json({
// 			message: `Error generating word search puzzle error:${error}`,
// 		});
// 	}
export async function getWordSearchPuzzle(req: AuthRequest, res: Response) {
	try {
		const difficulty = req.query.difficulty as 'easy' | 'medium' | 'hard';
		// Define difficulty settings
		const settings = {
			easy: { wordCount: 5, gridSize: 10 },
			medium: { wordCount: 8, gridSize: 15 },
			hard: { wordCount: 12, gridSize: 20 },
		};
		// Get settings based on difficulty
		const { wordCount, gridSize } = settings[difficulty] || settings.medium;
		// Generate the puzzle
		const { id, grid, words } = await generateWordSearch(wordCount, gridSize);
		res.json({
			id,
			grid,
			words,
			difficulty,
			gameType: 'wordsearch',
		});
	} catch (error) {
		console.error('Error generating word search puzzle:', error);
		res.status(500).json({
			message: `Error generating word search puzzle: ${error}`,
		});
	}
}
