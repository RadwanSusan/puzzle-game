// // src\components\Game.tsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './css/Game.css';
// interface GameProps {
// 	difficulty: 'easy' | 'medium' | 'hard';
// 	token: string;
// 	gameType: string;
// }
// interface PuzzleData {
// 	id: string;
// 	grid: number[][];
// 	solution?: number[][];
// }
// const Game: React.FC<GameProps> = ({ difficulty, token, gameType }) => {
// 	const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
// 	const [timer, setTimer] = useState<number>(0);
// 	const [userSolution, setUserSolution] = useState<number[][]>([]);
// 	const [isChecking, setIsChecking] = useState(false);
// 	const [cellStatus, setCellStatus] = useState<
// 		('correct' | 'error' | 'unchecked')[][]
// 	>([]);
// 	const [hintUsed, setHintUsed] = useState(false);
// 	useEffect(() => {
// 		const fetchPuzzle = async () => {
// 			try {
// 				const response = await axios.get(
// 					`/api/puzzle?difficulty=${difficulty}&type=${gameType}`,
// 					{
// 						headers: { Authorization: `Bearer ${token}` },
// 					},
// 				);
// 				setPuzzle(response.data);
// 				setUserSolution(
// 					response.data.grid.map((row: number[]) => [...row]),
// 				);
// 				setCellStatus(
// 					response.data.grid.map((row: number[]) =>
// 						row.map(() => 'unchecked'),
// 					),
// 				);
// 			} catch (error) {
// 				console.error('Error fetching puzzle:', error);
// 			}
// 		};
// 		fetchPuzzle();
// 		const interval = setInterval(() => {
// 			setTimer((prevTimer) => prevTimer + 1);
// 		}, 1000);
// 		return () => clearInterval(interval);
// 	}, [difficulty, token, gameType]);
// 	const handleSubmit = async () => {
// 		try {
// 			const response = await axios.post(
// 				'/api/score',
// 				{
// 					score: timer,
// 					difficulty,
// 					puzzleId: puzzle?.id,
// 					solution: userSolution,
// 					puzzleType: gameType,
// 				},
// 				{
// 					headers: { Authorization: `Bearer ${token}` },
// 				},
// 			);
// 			alert(response.data.message || 'Score submitted successfully!');
// 		} catch (error) {
// 			console.error('Error submitting score:', error);
// 			alert('Error submitting score. Please try again.');
// 		}
// 	};
// 	const formatTime = (seconds: number): string => {
// 		const minutes = Math.floor(seconds / 60);
// 		const remainingSeconds = seconds % 60;
// 		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
// 	};
// 	const handleCheck = async () => {
// 		setIsChecking(true);
// 		try {
// 			const response = await axios.post(
// 				'/api/check',
// 				{
// 					puzzleId: puzzle?.id,
// 					solution: userSolution,
// 				},
// 				{
// 					headers: { Authorization: `Bearer ${token}` },
// 				},
// 			);
// 			const newCellStatus = userSolution.map((row) =>
// 				row.map(() => 'correct' as 'correct' | 'error' | 'unchecked'),
// 			);
// 			response.data.errors.forEach(([row, col]: [number, number]) => {
// 				newCellStatus[row][col] = 'error';
// 			});
// 			setCellStatus(newCellStatus);
// 		} catch (error) {
// 			console.error('Error checking solution:', error);
// 			alert('Error checking solution. Please try again.');
// 		}
// 		setTimeout(() => setIsChecking(false), 2000);
// 	};
// 	const getCellClassName = (rowIndex: number, colIndex: number) => {
// 		if (isChecking) {
// 			return `cell-${cellStatus[rowIndex][colIndex]}`;
// 		}
// 		return puzzle?.grid[rowIndex][colIndex] !== 0
// 			? 'cell-given'
// 			: 'cell-input';
// 	};
// 	const handleHint = async () => {
// 		try {
// 			const response = await axios.post(
// 				'/api/hint',
// 				{
// 					puzzleId: puzzle?.id,
// 					puzzleType: gameType,
// 					userSolution,
// 				},
// 				{
// 					headers: { Authorization: `Bearer ${token}` },
// 				},
// 			);
// 			const { hint } = response.data;
// 			if (hint) {
// 				const newSolution = [...userSolution];
// 				newSolution[hint.row][hint.col] = hint.value;
// 				setUserSolution(newSolution);
// 				setHintUsed(true);
// 			} else {
// 				alert('No hint available');
// 			}
// 		} catch (error) {
// 			console.error('Error getting hint:', error);
// 			alert('Error getting hint. Please try again.');
// 		}
// 	};
// 	if (!puzzle) return <div>Loading puzzle...</div>;
// 	return (
// 		<div className='game'>
// 			<h1>Puzzle Game</h1>
// 			<div className='game-info'>
// 				<p>Difficulty: {difficulty}</p>
// 				<p>Time: {formatTime(timer)}</p>
// 			</div>
// 			<div className='game-board'>
// 				{puzzle.grid.map((row: number[], rowIndex: number) => (
// 					<div
// 						key={rowIndex}
// 						className='row'>
// 						{row.map((cell: number, colIndex: number) => (
// 							<input
// 								key={colIndex}
// 								type='number'
// 								min='0'
// 								max={puzzle.grid.length}
// 								value={userSolution[rowIndex][colIndex] || ''}
// 								onChange={(e) => {
// 									const newSolution = [...userSolution];
// 									newSolution[rowIndex][colIndex] =
// 										parseInt(e.target.value) || 0;
// 									setUserSolution(newSolution);
// 									const newCellStatus = [...cellStatus];
// 									newCellStatus[rowIndex][colIndex] = 'unchecked';
// 									setCellStatus(newCellStatus);
// 								}}
// 								disabled={cell !== 0}
// 								className={getCellClassName(rowIndex, colIndex)}
// 							/>
// 						))}
// 					</div>
// 				))}
// 			</div>
// 			<div className='game-controls'>
// 				<button onClick={handleCheck}>Check Solution</button>
// 				<button
// 					onClick={handleHint}
// 					disabled={hintUsed}>
// 					Get Hint
// 				</button>
// 				<button onClick={handleSubmit}>Submit Solution</button>
// 			</div>
// 		</div>
// 	);
// };
// export default Game;
// src/components/Game.tsx
import React from 'react';
import NumberPuzzleGame from './NumberPuzzleGame';
import WordSearchGame from './WordSearchGame';
import CrosswordGame from './CrosswordGame';
import './css/Game.css';
interface GameProps {
	difficulty: 'easy' | 'medium' | 'hard';
	token: string;
	gameType: 'number' | 'wordsearch' | 'crossword' | 'daily';
}
const Game: React.FC<GameProps> = ({ difficulty, token, gameType }) => {
	const renderGame = () => {
		switch (gameType) {
			case 'number':
				return (
					<NumberPuzzleGame
						difficulty={difficulty}
						token={token}
					/>
				);
			case 'wordsearch':
				return (
					<WordSearchGame
						difficulty={difficulty}
						token={token}
					/>
				);
			case 'crossword':
				return (
					<CrosswordGame
						difficulty={difficulty}
						token={token}
					/>
				);
			default:
				return <div>Invalid game type</div>;
		}
	};
	return <div className='game'>{renderGame()}</div>;
};
export default Game;
