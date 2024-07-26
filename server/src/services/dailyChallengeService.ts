// src\services\dailyChallengeService.ts
import Puzzle from '../models/Puzzle';
import { generateCrossword } from './crosswordGenerator';
import { generateWordSearch } from './wordSearchService';
import { generateNumberPuzzle } from './numberPuzzleService';
export async function generateDailyChallenge(): Promise<void> {
	const date = new Date().toISOString().split('T')[0];
	const existingChallenge = await Puzzle.findOne({
		type: 'dailyChallenge',
		date,
	});
	if (existingChallenge) return;
	const numberPuzzle = await generateNumberPuzzle('medium');
	const wordSearch = generateWordSearch([
		'DAILY',
		'CHALLENGE',
		'PUZZLE',
		'MASTER',
	]);
	const crossword = await generateCrossword();
	const dailyChallenge = new Puzzle({
		type: 'dailyChallenge',
		date,
		puzzles: [numberPuzzle, wordSearch, crossword],
	});
	await dailyChallenge.save();
}
export async function getDailyChallenge(): Promise<any> {
	const date = new Date().toISOString().split('T')[0];
	return await Puzzle.findOne({ type: 'dailyChallenge', date });
}
