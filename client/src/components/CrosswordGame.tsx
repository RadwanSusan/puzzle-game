// // src/components/CrosswordGame.tsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './css/Crossword.css';
// interface CrosswordGameProps {
// 	difficulty: 'easy' | 'medium' | 'hard';
// 	token: string;
// 	isDaily?: boolean;
// }
// interface CrosswordPuzzle {
// 	id: string;
// 	grid: string[][];
// 	clues: {
// 		across: { [key: number]: string };
// 		down: { [key: number]: string };
// 	};
// }
// const CrosswordGame: React.FC<CrosswordGameProps> = ({ difficulty, token }) => {
// 	const [puzzle, setPuzzle] = useState<CrosswordPuzzle | null>(null);
// 	const [userSolution, setUserSolution] = useState<string[][]>([]);
// 	const [timer, setTimer] = useState<number>(0);
// 	useEffect(() => {
// 		fetchPuzzle();
// 		const interval = setInterval(() => {
// 			setTimer((prevTimer) => prevTimer + 1);
// 		}, 1000);
// 		return () => clearInterval(interval);
// 	}, [difficulty, token]);
// 	const fetchPuzzle = async () => {
// 		try {
// 			const response = await axios.get(
// 				`/api/puzzle?difficulty=${difficulty}&type=crossword`,
// 				{ headers: { Authorization: `Bearer ${token}` } },
// 			);
// 			setPuzzle(response.data);
// 			setUserSolution(
// 				response.data.grid.map((row: string[]) =>
// 					row.map((cell) => (cell === '#' ? '#' : '')),
// 				),
// 			);
// 		} catch (error) {
// 			console.error('Error fetching puzzle:', error);
// 		}
// 	};
// 	const handleCellChange = (
// 		rowIndex: number,
// 		colIndex: number,
// 		value: string,
// 	) => {
// 		const newSolution = [...userSolution];
// 		newSolution[rowIndex][colIndex] = value.toUpperCase();
// 		setUserSolution(newSolution);
// 	};
// 	const handleSubmit = async () => {
// 		try {
// 			await axios.post(
// 				'/api/score',
// 				{
// 					score: timer,
// 					difficulty,
// 					puzzleId: puzzle?.id,
// 					solution: userSolution,
// 					gameType: 'crossword',
// 				},
// 				{ headers: { Authorization: `Bearer ${token}` } },
// 			);
// 			alert('Score submitted successfully!');
// 		} catch (error) {
// 			console.error('Error submitting score:', error);
// 			alert('Error submitting score. Please try again.');
// 		}
// 	};
// 	if (!puzzle) return <div>Loading puzzle...</div>;
// 	return (
// 		<div className='crossword-game'>
// 			<h1>Crossword Game</h1>
// 			<div className='game-info'>
// 				<p>Difficulty: {difficulty}</p>
// 				<p>Time: {formatTime(timer)}</p>
// 			</div>
// 			<div className='game-board'>
// 				{userSolution.map((row, rowIndex) => (
// 					<div
// 						key={rowIndex}
// 						className='row'>
// 						{row.map((cell, colIndex) =>
// 							cell === '#' ? (
// 								<div
// 									key={colIndex}
// 									className='cell black'></div>
// 							) : (
// 								<input
// 									key={colIndex}
// 									type='text'
// 									maxLength={1}
// 									value={cell}
// 									onChange={(e) =>
// 										handleCellChange(
// 											rowIndex,
// 											colIndex,
// 											e.target.value,
// 										)
// 									}
// 									className='cell'
// 								/>
// 							),
// 						)}
// 					</div>
// 				))}
// 			</div>
// 			<div className='clues'>
// 				<div className='across'>
// 					<h3>Across</h3>
// 					{Object.entries(puzzle.clues.across).map(([number, clue]) => (
// 						<p key={number}>
// 							{number}. {clue}
// 						</p>
// 					))}
// 				</div>
// 				<div className='down'>
// 					<h3>Down</h3>
// 					{Object.entries(puzzle.clues.down).map(([number, clue]) => (
// 						<p key={number}>
// 							{number}. {clue}
// 						</p>
// 					))}
// 				</div>
// 			</div>
// 			<button onClick={handleSubmit}>Submit Score</button>
// 		</div>
// 	);
// };
// const formatTime = (seconds: number): string => {
// 	const minutes = Math.floor(seconds / 60);
// 	const remainingSeconds = seconds % 60;
// 	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
// };
// export default CrosswordGame;

// src/components/WordSearchGame.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './css/WordSearch.css';

interface WordSearchGameProps {
	difficulty: 'easy' | 'medium' | 'hard';
	token: string;
	isDaily?: boolean;
}

interface WordSearchPuzzle {
	id: string;
	grid: string[][];
	words: string[];
}

const WordSearchGame: React.FC<WordSearchGameProps> = ({
	difficulty,
	token,
}) => {
	const [puzzle, setPuzzle] = useState<WordSearchPuzzle | null>(null);
	const [timer, setTimer] = useState<number>(0);
	const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
	const [foundWords, setFoundWords] = useState<string[]>([]);

	useEffect(() => {
		fetchPuzzle();
		const interval = setInterval(() => {
			setTimer((prevTimer) => prevTimer + 1);
		}, 1000);
		return () => clearInterval(interval);
	}, [difficulty, token]);

	const fetchPuzzle = async () => {
		try {
			const response = await axios.get(
				`/api/puzzle?difficulty=${difficulty}&type=wordsearch`,
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			setPuzzle(response.data);
		} catch (error) {
			console.error('Error fetching puzzle:', error);
			toast.error('Failed to load puzzle. Please try again.');
		}
	};

	const handleCellClick = (rowIndex: number, colIndex: number) => {
		const newSelectedCells = [...selectedCells, [rowIndex, colIndex]];
		setSelectedCells(newSelectedCells);

		const selectedWord = newSelectedCells
			.map(([r, c]) => puzzle!.grid[r][c])
			.join('');

		if (
			puzzle!.words.includes(selectedWord) &&
			!foundWords.includes(selectedWord)
		) {
			setFoundWords([...foundWords, selectedWord]);
			toast.success(`You found the word: ${selectedWord}!`);
			setSelectedCells([]);
		} else if (selectedWord.length === puzzle!.words[0].length) {
			setSelectedCells([]);
		}
	};

	const handleSubmit = async () => {
		try {
			await axios.post(
				'/api/score',
				{
					score: timer,
					difficulty,
					puzzleId: puzzle?.id,
					solution: foundWords,
					gameType: 'wordsearch',
				},
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			toast.success('Score submitted successfully!');
		} catch (error) {
			console.error('Error submitting score:', error);
			toast.error('Error submitting score. Please try again.');
		}
	};

	if (!puzzle) return <div>Loading puzzle...</div>;

	return (
		<div className='word-search-game'>
			<ToastContainer
				position='top-right'
				autoClose={3000}
			/>
			<h1>Word Search Game</h1>
			<div className='game-info'>
				<p>Difficulty: {difficulty}</p>
				<p>Time: {formatTime(timer)}</p>
				<p>
					Found Words: {foundWords.length} / {puzzle.words.length}
				</p>
			</div>
			<div className='game-board'>
				{puzzle.grid.map((row, rowIndex) => (
					<div
						key={rowIndex}
						className='row'>
						{row.map((cell, colIndex) => (
							<div
								key={colIndex}
								className={`cell ${
									selectedCells.some(
										([r, c]) => r === rowIndex && c === colIndex,
									)
										? 'selected'
										: ''
								}`}
								onClick={() => handleCellClick(rowIndex, colIndex)}>
								{cell}
							</div>
						))}
					</div>
				))}
			</div>
			<div className='word-list'>
				<h3>Words to Find:</h3>
				<ul>
					{puzzle.words.map((word, index) => (
						<li
							key={index}
							className={foundWords.includes(word) ? 'found' : ''}>
							{word}
						</li>
					))}
				</ul>
			</div>
			<button
				onClick={handleSubmit}
				disabled={foundWords.length !== puzzle.words.length}>
				Submit Score
			</button>
		</div>
	);
};

const formatTime = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default WordSearchGame;
