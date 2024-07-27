// src/components/NumberPuzzleGame.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Game.css';
interface NumberPuzzleGameProps {
	difficulty: 'easy' | 'medium' | 'hard';
	token: string;
	isDaily?: boolean;
}
interface NumberPuzzle {
	id: string;
	grid: number[][];
}
const NumberPuzzleGame: React.FC<NumberPuzzleGameProps> = ({
	difficulty,
	token,
}) => {
	const [puzzle, setPuzzle] = useState<NumberPuzzle | null>(null);
	const [userSolution, setUserSolution] = useState<number[][]>([]);
	const [timer, setTimer] = useState<number>(0);
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
				`/api/puzzle?difficulty=${difficulty}&type=number`,
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			setPuzzle(response.data);
			setUserSolution(response.data.grid.map((row: number[]) => [...row]));
		} catch (error) {
			console.error('Error fetching puzzle:', error);
		}
	};
	const handleCellChange = (
		rowIndex: number,
		colIndex: number,
		value: string,
	) => {
		const newSolution = [...userSolution];
		newSolution[rowIndex][colIndex] = value === '' ? 0 : parseInt(value, 10);
		setUserSolution(newSolution);
	};
	const handleSubmit = async () => {
		try {
			await axios.post(
				'/api/score',
				{
					score: timer,
					difficulty,
					puzzleId: puzzle?.id,
					solution: userSolution,
					puzzleType: 'number',
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
		<div className='number-puzzle-game'>
			<h1>Number Puzzle Game</h1>
			<div className='game-info'>
				<p>Difficulty: {difficulty}</p>
				<p>Time: {formatTime(timer)}</p>
			</div>
			<div className='game-board'>
				{userSolution.map((row, rowIndex) => (
					<div
						key={rowIndex}
						className='row'>
						{row.map((cell, colIndex) => (
							<input
								key={colIndex}
								type='number'
								min='1'
								max='9'
								value={cell || ''}
								onChange={(e) =>
									handleCellChange(rowIndex, colIndex, e.target.value)
								}
								className={
									puzzle.grid[rowIndex][colIndex] !== 0 ? 'given' : ''
								}
								disabled={puzzle.grid[rowIndex][colIndex] !== 0}
							/>
						))}
					</div>
				))}
			</div>
			<button onClick={handleSubmit}>Submit Score</button>
		</div>
	);
};
const formatTime = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
export default NumberPuzzleGame;
