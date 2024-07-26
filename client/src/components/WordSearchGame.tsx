// src/components/WordSearchGame.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/WordSearchGame.css';
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
		}
	};
	const handleCellClick = (rowIndex: number, colIndex: number) => {
		if (
			selectedCells.length === 0 ||
			isAdjacent(selectedCells[selectedCells.length - 1], [
				rowIndex,
				colIndex,
			])
		) {
			setSelectedCells([...selectedCells, [rowIndex, colIndex]]);
		}
	};
	const handleSelectionEnd = () => {
		const word = selectedCells
			.map(([row, col]) => puzzle!.grid[row][col])
			.join('');
		if (puzzle!.words.includes(word) && !foundWords.includes(word)) {
			setFoundWords([...foundWords, word]);
		}
		setSelectedCells([]);
	};
	const isAdjacent = (cell1: [number, number], cell2: [number, number]) => {
		const [row1, col1] = cell1;
		const [row2, col2] = cell2;
		return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1;
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
			alert('Score submitted successfully!');
		} catch (error) {
			console.error('Error submitting score:', error);
			alert('Error submitting score. Please try again.');
		}
	};
	if (!puzzle) return <div>Loading puzzle...</div>;
	return (
		<div className='word-search-game'>
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
								onMouseDown={() => handleCellClick(rowIndex, colIndex)}
								onMouseEnter={(e) =>
									e.buttons === 1 &&
									handleCellClick(rowIndex, colIndex)
								}
								onMouseUp={handleSelectionEnd}>
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
