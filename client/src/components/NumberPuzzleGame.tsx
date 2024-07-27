import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './css/NumberPuzzle.module.css';
import Modal from './Modal';
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
	const [gameCompleted, setGameCompleted] = useState(false);
	const [isGuideOpen, setIsGuideOpen] = useState(false);
	const [hintUsed, setHintUsed] = useState(false);
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
			toast.error('Failed to load puzzle. Please try again.');
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
		checkCompletion(newSolution);
	};
	const checkCompletion = (solution: number[][]) => {
		const isComplete = solution.every((row) =>
			row.every((cell) => cell !== 0),
		);
		if (isComplete) {
			setGameCompleted(true);
			showCongratulations();
		}
	};
	const handleSubmit = async () => {
		if (!gameCompleted) {
			toast.warn("You haven't completed the puzzle yet!");
			return;
		}
		try {
			const score = calculateScore();
			await axios.post(
				'/api/score',
				{
					score,
					difficulty,
					puzzleId: puzzle?.id,
					solution: userSolution,
					puzzleType: 'number',
					time: timer,
				},
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			toast.success('Score submitted successfully!');
		} catch (error) {
			console.error('Error submitting score:', error);
			toast.error('Error submitting score. Please try again.');
		}
	};
	const calculateScore = () => {
		const baseScore = 1000;
		const timeDeduction = timer * 2;
		const difficultyMultiplier =
			difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
		return Math.max(
			0,
			Math.floor((baseScore - timeDeduction) * difficultyMultiplier),
		);
	};
	const showCongratulations = () => {
		const score = calculateScore();
		toast.success(
			<div>
				<h3>Congratulations!</h3>
				<p>You've completed the puzzle!</p>
				<p>Your score: {score}</p>
				<p>Time: {formatTime(timer)}</p>
			</div>,
			{
				position: 'top-center',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: false,
				pauseOnHover: true,
				draggable: false,
				closeButton: true,
			},
		);
	};
	const handleGetHint = async () => {
		if (hintUsed) {
			toast.warn('You have already used your hint for this game.');
			return;
		}
		try {
			const response = await axios.post(
				'/api/hint',
				{
					puzzleId: puzzle?.id,
					puzzleType: 'number',
					userSolution,
				},
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			const { hint } = response.data;
			if (hint) {
				const newSolution = [...userSolution];
				newSolution[hint.row][hint.col] = hint.value;
				setUserSolution(newSolution);
				setHintUsed(true);
				toast.info(
					`Hint: The value at row ${hint.row + 1}, column ${
						hint.col + 1
					} is ${hint.value}`,
				);
			} else {
				toast.info('No hint available');
			}
		} catch (error) {
			console.error('Error getting hint:', error);
			toast.error('Error getting hint. Please try again.');
		}
	};
	const renderGuide = () => (
		<div>
			<h2>How to Play</h2>
			<ol>
				<li>Fill in the empty cells with numbers from 1 to 9.</li>
				<li>
					Each number can only appear once in each row, column, and 3x3
					box.
				</li>
				<li>Use logic to deduce the correct numbers for each cell.</li>
				<li>
					Use the hint button if you're stuck (only one hint per game).
				</li>
			</ol>
			<h3>Scoring System</h3>
			<p>Your score is calculated as follows:</p>
			<ul>
				<li>Base score: 1000 points</li>
				<li>Time deduction: 2 points per second</li>
				<li>
					Difficulty multiplier:
					<ul>
						<li>Easy: x1</li>
						<li>Medium: x1.5</li>
						<li>Hard: x2</li>
					</ul>
				</li>
			</ul>
			<p>
				Final Score = (Base Score - Time Deduction) x Difficulty Multiplier
			</p>
		</div>
	);
	if (!puzzle) return <div>Loading puzzle...</div>;
	return (
		<div className={styles.numberPuzzleGame}>
			<ToastContainer />
			<h1>Number Puzzle Game</h1>
			<div className={styles.gameInfo}>
				<p>Difficulty: {difficulty}</p>
				<p>Time: {formatTime(timer)}</p>
				{gameCompleted && <p>Score: {calculateScore()}</p>}
				<button onClick={() => setIsGuideOpen(true)}>How to Play</button>
			</div>
			<div
				className={styles.gameBoard}
				style={{
					gap: `${
						difficulty === 'easy' ? 20 : difficulty === 'medium' ? 15 : 10
					}px`,
				}}>
				{userSolution.map((row, rowIndex) => (
					<div
						key={rowIndex}
						className={styles.row}
						style={{
							gridTemplateColumns: `repeat(${puzzle.grid.length}, 1fr)`,
							gap: `${
								difficulty === 'easy'
									? 30
									: difficulty === 'medium'
									? 25
									: 20
							}px`,
						}}>
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
								className={`${styles.cell} ${
									puzzle.grid[rowIndex][colIndex] !== 0
										? styles.given
										: ''
								}`}
								disabled={puzzle.grid[rowIndex][colIndex] !== 0}
							/>
						))}
					</div>
				))}
			</div>
			<div className={styles.buttonContainer}>
				<button
					onClick={handleGetHint}
					className={`${styles.hintButton} ${
						hintUsed ? styles.hintUsed : ''
					}`}
					disabled={hintUsed || gameCompleted}>
					{hintUsed ? 'Hint Used' : 'Get Hint'}
				</button>
				<button
					onClick={handleSubmit}
					className={styles.submitButton}
					disabled={!gameCompleted}>
					Submit Score
				</button>
			</div>
			<Modal
				isOpen={isGuideOpen}
				onClose={() => setIsGuideOpen(false)}>
				{renderGuide()}
			</Modal>
		</div>
	);
};
const formatTime = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
export default NumberPuzzleGame;
