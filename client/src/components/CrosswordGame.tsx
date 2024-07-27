import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './css/Crossword.module.css';
import Modal from './Modal';
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
	const [gameCompleted, setGameCompleted] = useState(false);
	const [isGuideOpen, setIsGuideOpen] = useState(false);
	const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
		null,
	);
	const fetchPuzzle = useCallback(async () => {
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
			toast.error('Failed to load puzzle. Please try again.');
		}
	}, [difficulty, token]);
	useEffect(() => {
		fetchPuzzle();
		const interval = setInterval(() => {
			setTimer((prevTimer) => prevTimer + 1);
		}, 1000);
		return () => clearInterval(interval);
	}, [fetchPuzzle]);
	const handleCellChange = useCallback(
		(rowIndex: number, colIndex: number, value: string) => {
			setUserSolution((prevSolution) => {
				const newSolution = [...prevSolution];
				newSolution[rowIndex][colIndex] = value.toUpperCase();
				return newSolution;
			});
		},
		[],
	);
	const handleCellClick = useCallback(
		(rowIndex: number, colIndex: number) => {
			if (
				selectedCell &&
				selectedCell[0] === rowIndex &&
				selectedCell[1] === colIndex
			) {
				console.log('Cell already selected');
			} else {
				setSelectedCell([rowIndex, colIndex]);
			}
		},
		[selectedCell],
	);
	const checkCompletion = useCallback(() => {
		if (!puzzle || !puzzle.grid || !userSolution) return;
		const isComplete = puzzle.grid.every((row, rowIndex) =>
			row.every(
				(cell, colIndex) =>
					cell === '#' ||
					(userSolution[rowIndex][colIndex] &&
						userSolution[rowIndex][colIndex] === cell),
			),
		);
		if (isComplete) {
			setGameCompleted(true);
			showCongratulations();
		}
	}, [puzzle, userSolution]);
	useEffect(() => {
		checkCompletion();
	}, [userSolution, checkCompletion]);
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
					puzzleType: 'crossword',
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
	const renderGuide = () => (
		<div>
			<h2>How to Play Crossword</h2>
			<ol>
				<li>Click on a cell to select it and start typing.</li>
				<li>Use the clues provided to fill in the words.</li>
				<li>Click on a cell twice to change direction (across/down).</li>
				<li>Complete all words to finish the puzzle.</li>
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
		<div className={`${styles.crosswordGame} ${styles[difficulty]}`}>
			<ToastContainer />
			<h1>Crossword Puzzle</h1>
			<div className={styles.gameInfo}>
				<p>Difficulty: {difficulty}</p>
				<p>Time: {formatTime(timer)}</p>
				{gameCompleted && <p>Score: {calculateScore()}</p>}
				<button onClick={() => setIsGuideOpen(true)}>How to Play</button>
			</div>
			<div className={styles.cluesContainer}>
				<div className={styles.acrossClues}>
					<h3>Across</h3>
					{Object.entries(puzzle.clues.across).map(([number, clue]) => (
						<p key={number}>
							{number}. {clue}
						</p>
					))}
				</div>
				<div className={styles.downClues}>
					<h3>Down</h3>
					{Object.entries(puzzle.clues.down).map(([number, clue]) => (
						<p key={number}>
							{number}. {clue}
						</p>
					))}
				</div>
			</div>
			<div className={styles.gameContainer}>
				<div className={styles.gridContainer}>
					{puzzle.grid.map((row, rowIndex) => (
						<div
							key={rowIndex}
							className={styles.row}>
							{row.map((cell, colIndex) => (
								<div
									key={colIndex}
									className={styles.cellWrapper}>
									{cell !== '#' && (
										<span className={styles.cellNumber}>
											{getClueNumber(puzzle, rowIndex, colIndex)}
										</span>
									)}
									<input
										type='text'
										maxLength={1}
										value={userSolution[rowIndex][colIndex] || ''}
										onChange={(e) =>
											handleCellChange(
												rowIndex,
												colIndex,
												e.target.value,
											)
										}
										onClick={() =>
											handleCellClick(rowIndex, colIndex)
										}
										className={`${styles.cell} ${
											selectedCell &&
											selectedCell[0] === rowIndex &&
											selectedCell[1] === colIndex
												? styles.selected
												: ''
										} ${cell === '#' ? styles.black : ''}`}
										disabled={cell === '#'}
									/>
								</div>
							))}
						</div>
					))}
				</div>
			</div>
			<div className={styles.buttonContainer}>
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
const getClueNumber = (
	puzzle: CrosswordPuzzle,
	row: number,
	col: number,
): number | null => {
	const isAcrossStart = isStartOfWord(puzzle.grid, row, col, 'across');
	const isDownStart = isStartOfWord(puzzle.grid, row, col, 'down');
	if (!isAcrossStart && !isDownStart) {
		return null;
	}
	for (const [numberStr] of Object.entries(puzzle.clues.across)) {
		const number = parseInt(numberStr);
		if (findWordStart(puzzle.grid, number, 'across') === `${row},${col}`) {
			return number;
		}
	}
	for (const [numberStr] of Object.entries(puzzle.clues.down)) {
		const number = parseInt(numberStr);
		if (findWordStart(puzzle.grid, number, 'down') === `${row},${col}`) {
			return number;
		}
	}
	return null;
};
const isStartOfWord = (
	grid: string[][],
	row: number,
	col: number,
	direction: 'across' | 'down',
): boolean => {
	if (grid[row][col] === '#') return false;
	if (direction === 'across') {
		return col === 0 || grid[row][col - 1] === '#';
	} else {
		return row === 0 || grid[row - 1][col] === '#';
	}
};
const findWordStart = (
	grid: string[][],
	clueNumber: number,
	direction: 'across' | 'down',
): string | null => {
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			if (isStartOfWord(grid, row, col, direction)) {
				clueNumber--;
				if (clueNumber === 0) {
					return `${row},${col}`;
				}
			}
		}
	}
	return null;
};
export default CrosswordGame;
