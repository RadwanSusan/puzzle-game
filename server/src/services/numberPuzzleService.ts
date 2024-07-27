import Puzzle, { IPuzzle } from '../models/Puzzle';
function shuffleArray(array: number[]): number[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
function generateSolution(size: number): number[][] {
	const solution = Array(size)
		.fill(null)
		.map(() => Array(size).fill(0));
	const numbers = Array.from({ length: size }, (_, i) => i + 1);
	for (let i = 0; i < size; i++) {
		const shuffled = shuffleArray([...numbers]);
		for (let j = 0; j < size; j++) {
			solution[i][j] = shuffled[j];
		}
	}
	return solution;
}
function removeNumbers(
	grid: number[][],
	difficulty: 'easy' | 'medium' | 'hard',
): number[][] {
	const size = grid.length;
	const puzzleGrid = grid.map((row) => [...row]);
	const cellsToRemove = {
		easy: Math.floor(size * size * 0.3),
		medium: Math.floor(size * size * 0.5),
		hard: Math.floor(size * size * 0.7),
	}[difficulty];
	for (let i = 0; i < cellsToRemove; i++) {
		let row, col;
		do {
			row = Math.floor(Math.random() * size);
			col = Math.floor(Math.random() * size);
		} while (puzzleGrid[row][col] === 0);
		puzzleGrid[row][col] = 0;
	}
	return puzzleGrid;
}
export async function generateNumberPuzzle(
	difficulty: 'easy' | 'medium' | 'hard',
): Promise<IPuzzle> {
	const size = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 9;
	const solution = generateSolution(size);
	const grid = removeNumbers(solution, difficulty);
	const puzzle = new Puzzle({
		type: 'number',
		grid,
		difficulty,
		solution,
	});
	await puzzle.save();
	return puzzle;
}
