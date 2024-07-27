import Puzzle from '../models/Puzzle';
export async function getWordSearchHint(
	puzzleId: string,
	foundWords: string[],
): Promise<string | null> {
	const puzzle = await Puzzle.findById(puzzleId);
	if (!puzzle || puzzle.type !== 'wordsearch') return null;
	const unFoundWords = (puzzle.solution as string[]).filter(
		(word) => !foundWords.includes(word),
	);
	if (unFoundWords.length === 0) return null;
	const hintWord =
		unFoundWords[Math.floor(Math.random() * unFoundWords.length)];
	return hintWord.substring(0, 2);
}
export async function getCrosswordHint(
	puzzleId: string,
	userSolution: string[][],
): Promise<{ row: number; col: number; letter: string } | null> {
	const puzzle = await Puzzle.findById(puzzleId);
	if (!puzzle || puzzle.type !== 'crossword') return null;
	const solution = puzzle.solution as string[][];
	for (let i = 0; i < solution.length; i++) {
		for (let j = 0; j < solution[i].length; j++) {
			if (
				solution[i][j] !== '' &&
				(!userSolution[i] || userSolution[i][j] !== solution[i][j])
			) {
				return { row: i, col: j, letter: solution[i][j] };
			}
		}
	}
	return null;
}

export async function getNumberPuzzleHint(
	puzzleId: string,
	userSolution: number[][],
): Promise<{ row: number; col: number; value: number } | null> {
	const puzzle = await Puzzle.findById(puzzleId);
	if (!puzzle || puzzle.type !== 'number') return null;
	const solution = puzzle.solution as number[][];
	for (let i = 0; i < solution.length; i++) {
		for (let j = 0; j < solution[i].length; j++) {
			if (userSolution[i][j] !== solution[i][j]) {
				return { row: i, col: j, value: solution[i][j] };
			}
		}
	}
	return null;
}
