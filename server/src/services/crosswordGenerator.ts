import Puzzle from '../models/Puzzle';
interface CrosswordCell {
	letter: string;
	number?: number;
}
interface CrosswordClue {
	number: number;
	direction: 'across' | 'down';
	clue: string;
}
interface Word {
	word: string;
	clue: string;
}
const wordList: Word[] = [
	{
		word: 'PUZZLE',
		clue: 'A game, toy, or problem designed to test ingenuity or knowledge',
	},
	{
		word: 'CROSSWORD',
		clue: 'A word puzzle in which words are filled into a grid',
	},
	{ word: 'GAME', clue: 'An activity engaged in for diversion or amusement' },
	{
		word: 'CLUE',
		clue: 'A piece of evidence or information used in the detection of a mystery',
	},
	{
		word: 'WORD',
		clue: 'A single distinct meaningful element of speech or writing',
	},
	{
		word: 'GRID',
		clue: 'A network of lines that cross each other to form a series of squares or rectangles',
	},
	{
		word: 'SOLVE',
		clue: 'Find an answer to, explanation for, or means of effectively dealing with a problem',
	},
	{ word: 'HINT', clue: 'A slight or indirect indication or suggestion' },
	{
		word: 'LETTER',
		clue: 'A character representing one or more of the sounds used in speech',
	},
	{
		word: 'ANSWER',
		clue: 'A thing said, written, or done to deal with or as a reaction to a question or situation',
	},
	{
		word: 'CHALLENGE',
		clue: "A task or situation that tests someone's abilities",
	},
	{ word: 'QUIZ', clue: 'A test of knowledge, especially as a competition' },
	{
		word: 'BRAIN',
		clue: 'An organ of soft nervous tissue contained in the skull',
	},
	{ word: 'THINK', clue: 'Have a particular belief or idea' },
	{ word: 'SMART', clue: 'Having or showing a quick-witted intelligence' },
	{
		word: 'LOGIC',
		clue: 'Reasoning conducted or assessed according to strict principles of validity',
	},
	{ word: 'SKILL', clue: 'The ability to do something well; expertise' },
	{
		word: 'LEARN',
		clue: 'Gain or acquire knowledge of or skill in something by study, experience, or being taught',
	},
	{
		word: 'MIND',
		clue: 'The element of a person that enables them to be aware of the world and their experiences',
	},
	{
		word: 'KNOWLEDGE',
		clue: 'Facts, information, and skills acquired by a person through experience or education',
	},
];
function shuffleArray<T>(array: T[]): T[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
function createEmptyGrid(size: number): CrosswordCell[][] {
	return Array(size)
		.fill(null)
		.map(() =>
			Array(size)
				.fill(null)
				.map(() => ({ letter: '' })),
		);
}
function canPlaceWordHorizontally(
	grid: CrosswordCell[][],
	word: string,
	row: number,
	col: number,
): boolean {
	if (col + word.length > grid[0].length) return false;
	if (col > 0 && grid[row][col - 1].letter !== '') return false;
	if (
		col + word.length < grid[0].length &&
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
function canPlaceWordVertically(
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
	number: number,
): void {
	if (direction === 'across') {
		for (let i = 0; i < word.length; i++) {
			grid[row][col + i].letter = word[i];
			if (i === 0) grid[row][col].number = number;
		}
	} else {
		for (let i = 0; i < word.length; i++) {
			grid[row + i][col].letter = word[i];
			if (i === 0) grid[row][col].number = number;
		}
	}
}
export async function generateCrossword(
	difficulty: 'easy' | 'medium' | 'hard',
): Promise<any> {
	const size = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 10 : 12;
	const wordCount =
		difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
	const words = shuffleArray(wordList).slice(0, wordCount);
	words.sort((a, b) => b.word.length - a.word.length);
	const grid = createEmptyGrid(size);
	const clues: {
		across: { [key: number]: string };
		down: { [key: number]: string };
	} = { across: {}, down: {} };
	let clueNumber = 1;
	for (const { word, clue } of words) {
		let placed = false;
		for (let attempts = 0; attempts < 100 && !placed; attempts++) {
			const row = Math.floor(Math.random() * size);
			const col = Math.floor(Math.random() * size);
			const direction = Math.random() < 0.5 ? 'across' : 'down';
			if (
				direction === 'across' &&
				canPlaceWordHorizontally(grid, word, row, col)
			) {
				placeWord(grid, word, row, col, 'across', clueNumber);
				clues.across[clueNumber] = clue;
				clueNumber++;
				placed = true;
			} else if (
				direction === 'down' &&
				canPlaceWordVertically(grid, word, row, col)
			) {
				placeWord(grid, word, row, col, 'down', clueNumber);
				clues.down[clueNumber] = clue;
				clueNumber++;
				placed = true;
			}
		}
	}
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			if (grid[i][j].letter === '') {
				grid[i][j].letter = '#';
			}
		}
	}
	const puzzle = new Puzzle({
		type: 'crossword',
		grid: grid.map((row) => row.map((cell) => cell.letter)),
		clues,
		difficulty,
	});
	await puzzle.save();
	return {
		_id: puzzle._id,
		grid: grid.map((row) => row.map((cell) => cell.letter)),
		clues,
	};
}
