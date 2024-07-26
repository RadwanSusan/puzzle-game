// src\services\wordSearchService.ts
export function generateWordSearch(
	words: string[],
	gridSize: number = 15,
): { grid: string[][]; words: string[] } {
	const grid: string[][] = Array(gridSize)
		.fill(null)
		.map(() => Array(gridSize).fill(''));
	const directions = [
		[0, 1],
		[1, 0],
		[1, 1],
		[-1, 1],
		[0, -1],
		[-1, 0],
		[-1, -1],
		[1, -1],
	];
	const placedWords: string[] = [];
	words.sort((a, b) => b.length - a.length);
	for (const word of words) {
		let placed = false;
		for (let attempts = 0; attempts < 100 && !placed; attempts++) {
			const direction =
				directions[Math.floor(Math.random() * directions.length)];
			const row = Math.floor(Math.random() * gridSize);
			const col = Math.floor(Math.random() * gridSize);
			if (canPlaceWord(grid, word, row, col, direction)) {
				placeWord(grid, word, row, col, direction);
				placedWords.push(word);
				placed = true;
			}
		}
	}
	for (let i = 0; i < gridSize; i++) {
		for (let j = 0; j < gridSize; j++) {
			if (grid[i][j] === '') {
				grid[i][j] = String.fromCharCode(
					65 + Math.floor(Math.random() * 26),
				);
			}
		}
	}
	return { grid, words: placedWords };
}
function canPlaceWord(
	grid: string[][],
	word: string,
	row: number,
	col: number,
	direction: number[],
): boolean {
	const [dx, dy] = direction;
	for (let i = 0; i < word.length; i++) {
		const newRow = row + i * dx;
		const newCol = col + i * dy;
		if (
			newRow < 0 ||
			newRow >= grid.length ||
			newCol < 0 ||
			newCol >= grid[0].length
		) {
			return false;
		}
		if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i]) {
			return false;
		}
	}
	return true;
}
function placeWord(
	grid: string[][],
	word: string,
	row: number,
	col: number,
	direction: number[],
): void {
	const [dx, dy] = direction;
	for (let i = 0; i < word.length; i++) {
		grid[row + i * dx][col + i * dy] = word[i];
	}
}