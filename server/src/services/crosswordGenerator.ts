// src\services\crosswordGenerator.ts
interface CrosswordCell {
	letter: string;
	number?: number;
}
interface CrosswordClue {
	number: number;
	direction: 'across' | 'down';
	clue: string;
}
async function fetchWords(count: number): Promise<string[]> {
	return ['PUZZLE', 'GAME', 'CROSSWORD', 'CHALLENGE', 'CLUE'];
}
async function fetchClue(word: string): Promise<string> {
	return `Clue for ${word}`;
}
export async function generateCrossword(
	size: number = 15,
): Promise<{ grid: CrosswordCell[][]; clues: CrosswordClue[] }> {
	const words = await fetchWords(10);
	words.sort((a, b) => b.length - a.length);
	const grid: CrosswordCell[][] = Array(size)
		.fill(null)
		.map(() =>
			Array(size)
				.fill(null)
				.map(() => ({ letter: '' })),
		);
	const placedWords: {
		word: string;
		row: number;
		col: number;
		direction: 'across' | 'down';
	}[] = [];
	const clues: CrosswordClue[] = [];
	let clueNumber = 1;
	for (const word of words) {
		const placements = findPlacements(grid, word);
		if (placements.length > 0) {
			const { row, col, direction } =
				placements[Math.floor(Math.random() * placements.length)];
			placeWord(grid, word, row, col, direction);
			placedWords.push({ word, row, col, direction });
			if (
				direction === 'across' &&
				(col === 0 || grid[row][col - 1].letter === '')
			) {
				grid[row][col].number = clueNumber;
				clues.push({
					number: clueNumber,
					direction: 'across',
					clue: await fetchClue(word),
				});
				clueNumber++;
			}
			if (
				direction === 'down' &&
				(row === 0 || grid[row - 1][col].letter === '')
			) {
				grid[row][col].number = clueNumber;
				clues.push({
					number: clueNumber,
					direction: 'down',
					clue: await fetchClue(word),
				});
				clueNumber++;
			}
		}
	}
	return { grid, clues };
}
function findPlacements(
	grid: CrosswordCell[][],
	word: string,
): { row: number; col: number; direction: 'across' | 'down' }[] {
	const placements: {
		row: number;
		col: number;
		direction: 'across' | 'down';
	}[] = [];
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			if (canPlaceWordAcross(grid, word, row, col)) {
				placements.push({ row, col, direction: 'across' });
			}
			if (canPlaceWordDown(grid, word, row, col)) {
				placements.push({ row, col, direction: 'down' });
			}
		}
	}
	return placements;
}
function canPlaceWordAcross(
	grid: CrosswordCell[][],
	word: string,
	row: number,
	col: number,
): boolean {
	if (col + word.length > grid[row].length) return false;
	if (col > 0 && grid[row][col - 1].letter !== '') return false;
	if (
		col + word.length < grid[row].length &&
		grid[row][col + word.length].letter !== ''
	)
		return false;
	for (let i = 0; i < word.length; i++) {
		if (
			grid[row][col + i].letter !== '' &&
			grid[row][col + i].letter !== word[i]
		)
			return false;
	}
	return true;
}
function canPlaceWordDown(
	grid: CrosswordCell[][],
	word: string,
	row: number,
	col: number,
): boolean {
	if (row + word.length > grid.length) return false;
	if (row > 0 && grid[row - 1][col].letter !== '') return false;
	if (
		row + word.length < grid.length &&
		grid[row + word.length][col].letter !== ''
	)
		return false;
	for (let i = 0; i < word.length; i++) {
		if (
			grid[row + i][col].letter !== '' &&
			grid[row + i][col].letter !== word[i]
		)
			return false;
	}
	return true;
}
function placeWord(
	grid: CrosswordCell[][],
	word: string,
	row: number,
	col: number,
	direction: 'across' | 'down',
): void {
	for (let i = 0; i < word.length; i++) {
		if (direction === 'across') {
			grid[row][col + i].letter = word[i];
		} else {
			grid[row + i][col].letter = word[i];
		}
	}
}
