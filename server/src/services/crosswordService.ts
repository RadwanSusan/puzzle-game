interface CrosswordCell {
	letter: string;
	number?: number;
}
interface CrosswordClue {
	number: number;
	direction: 'across' | 'down';
	clue: string;
}
export function generateCrossword(words: string[]): {
	grid: CrosswordCell[][];
	clues: CrosswordClue[];
} {
	const size = 10;
	const grid: CrosswordCell[][] = Array(size)
		.fill(null)
		.map(() =>
			Array(size)
				.fill(null)
				.map(() => ({ letter: '' })),
		);
	const clues: CrosswordClue[] = [];
	let clueNumber = 1;
	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		if (i % 2 === 0) {
			const row = i;
			for (let j = 0; j < word.length; j++) {
				grid[row][j] = { letter: word[j] };
				if (j === 0) grid[row][j].number = clueNumber;
			}
			clues.push({
				number: clueNumber,
				direction: 'across',
				clue: `Clue for ${word}`,
			});
		} else {
			const col = i - 1;
			for (let j = 0; j < word.length; j++) {
				grid[j][col] = { letter: word[j] };
				if (j === 0) grid[j][col].number = clueNumber;
			}
			clues.push({
				number: clueNumber,
				direction: 'down',
				clue: `Clue for ${word}`,
			});
		}
		clueNumber++;
	}
	return { grid, clues };
}
