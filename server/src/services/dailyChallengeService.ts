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
	const {
		id: wordSearchId,
		grid: wordSearchGrid,
		words: wordSearchWords,
	} = await generateWordSearch(8, 15); // medium difficulty
	const { grid: crosswordGrid, clues: crosswordClues } =
		await generateCrossword();
	const dailyChallenge = new Puzzle({
		type: 'dailyChallenge',
		date,
		puzzles: [
			{
				type: 'number',
				puzzle: numberPuzzle,
			},
			{
				type: 'wordsearch',
				puzzle: {
					id: wordSearchId,
					grid: wordSearchGrid,
					words: wordSearchWords,
				},
			},
			{
				type: 'crossword',
				puzzle: {
					grid: crosswordGrid,
					clues: crosswordClues,
				},
			},
		],
	});
	await dailyChallenge.save();
}
