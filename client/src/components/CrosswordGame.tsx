// src/components/CrosswordGame.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/CrosswordGame.css';
interface CrosswordGameProps {
	difficulty: 'easy' | 'medium' | 'hard';
	token: string;
	isDaily?: boolean;
}
interface CrosswordPuzzle {
	id: string;
	grid: string[][];
	clues: {
		across: { [key: number]: string };
		down: { [key: number]: string };
	};
}
const CrosswordGame: React.FC<CrosswordGameProps> = ({ difficulty, token }) => {
	const [puzzle, setPuzzle] = useState<CrosswordPuzzle | null>(null);
	const [userSolution, setUserSolution] = useState<string[][]>([]);
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
				`/api/puzzle?difficulty=${difficulty}&type=crossword`,
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			setPuzzle(response.data);
			setUserSolution(
				response.data.grid.map((row: string[]) =>
					row.map((cell) => (cell === '#' ? '#' : '')),
				),
			);
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
		newSolution[rowIndex][colIndex] = value.toUpperCase();
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
					gameType: 'crossword',
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
		<div className='crossword-game'>
			<h1>Crossword Game</h1>
			<div className='game-info'>
				<p>Difficulty: {difficulty}</p>
				<p>Time: {formatTime(timer)}</p>
			</div>
			<div className='game-board'>
				{userSolution.map((row, rowIndex) => (
					<div
						key={rowIndex}
						className='row'>
						{row.map((cell, colIndex) =>
							cell === '#' ? (
								<div
									key={colIndex}
									className='cell black'></div>
							) : (
								<input
									key={colIndex}
									type='text'
									maxLength={1}
									value={cell}
									onChange={(e) =>
										handleCellChange(
											rowIndex,
											colIndex,
											e.target.value,
										)
									}
									className='cell'
								/>
							),
						)}
					</div>
				))}
			</div>
			<div className='clues'>
				<div className='across'>
					<h3>Across</h3>
					{Object.entries(puzzle.clues.across).map(([number, clue]) => (
						<p key={number}>
							{number}. {clue}
						</p>
					))}
				</div>
				<div className='down'>
					<h3>Down</h3>
					{Object.entries(puzzle.clues.down).map(([number, clue]) => (
						<p key={number}>
							{number}. {clue}
						</p>
					))}
				</div>
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
export default CrosswordGame;
