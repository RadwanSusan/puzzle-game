import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './css/WordSearch.module.css';
import Modal from './Modal';
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
interface FoundWord {
	word: string;
	cells: [number, number][];
}
const WordSearchGame: React.FC<WordSearchGameProps> = ({
	difficulty,
	token,
}) => {
	const [puzzle, setPuzzle] = useState<WordSearchPuzzle | null>(null);
	const [timer, setTimer] = useState<number>(0);
	const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
	const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
	const [isSelecting, setIsSelecting] = useState(false);
	const [hintWord, setHintWord] = useState<string | null>(null);
	const [selectedHintWord, setSelectedHintWord] = useState<string | null>(
		null,
	);
	const [hintUsed, setHintUsed] = useState(false);
	const [gameCompleted, setGameCompleted] = useState(false);
	const [isGuideOpen, setIsGuideOpen] = useState(false);
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
	const handleCellMouseDown = (rowIndex: number, colIndex: number) => {
		setIsSelecting(true);
		setSelectedCells([[rowIndex, colIndex]]);
	};
	const handleCellMouseEnter = (rowIndex: number, colIndex: number) => {
		if (isSelecting) {
			const lastCell = selectedCells[selectedCells.length - 1];
			if (isValidSelection(lastCell, [rowIndex, colIndex])) {
				setSelectedCells([...selectedCells, [rowIndex, colIndex]]);
			}
		}
	};
	const handleCellMouseUp = useCallback(() => {
		setIsSelecting(false);
		const selectedWord = getSelectedWord();
		if (
			puzzle!.words.includes(selectedWord) &&
			!foundWords.some((fw) => fw.word === selectedWord)
		) {
			const newFoundWords = [
				...foundWords,
				{ word: selectedWord, cells: [...selectedCells] },
			];
			setFoundWords(newFoundWords);
			toast.success(`You found "${selectedWord}"!`, {
				position: 'top-center',
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			if (newFoundWords.length === puzzle!.words.length) {
				setGameCompleted(true);
				showCongratulations();
			}
		}
		setSelectedCells([]);
	}, [selectedCells, puzzle, foundWords]);
	useEffect(() => {
		const handleGlobalMouseUp = () => {
			if (isSelecting) {
				handleCellMouseUp();
			}
		};
		window.addEventListener('mouseup', handleGlobalMouseUp);
		return () => {
			window.removeEventListener('mouseup', handleGlobalMouseUp);
		};
	}, [isSelecting, handleCellMouseUp]);
	const isValidSelection = (
		cell1: [number, number],
		cell2: [number, number],
	) => {
		const [row1, col1] = cell1;
		const [row2, col2] = cell2;
		const rowDiff = Math.abs(row1 - row2);
		const colDiff = Math.abs(col1 - col2);
		return (
			(rowDiff === 0 && colDiff === 1) ||
			(rowDiff === 1 && colDiff === 0) ||
			(rowDiff === 1 && colDiff === 1)
		);
	};
	const getSelectedWord = () => {
		return selectedCells.map(([row, col]) => puzzle!.grid[row][col]).join('');
	};
	const showCongratulations = () => {
		const score = calculateScore();
		toast.success(
			<div>
				<h3>Congratulations!</h3>
				<p>You've found all the words!</p>
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
	const renderGuide = () => (
		<div>
			<h2>How to Play</h2>
			<ol>
				<li>Find all the words listed below the grid.</li>
				<li>Click and drag to select letters in the grid.</li>
				<li>Words can be horizontal, vertical, or diagonal.</li>
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
	const handleSubmit = async () => {
		if (!gameCompleted) {
			toast.warn("You haven't found all the words yet!");
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
					solution: foundWords.map((fw) => fw.word),
					gameType: 'wordsearch',
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
	const handleGetHint = () => {
		if (hintUsed) {
			toast.warn('You have already used your hint for this game.', {
				position: 'top-center',
				autoClose: 3000,
			});
			return;
		}
		if (selectedHintWord) {
			setHintWord(selectedHintWord);
			toast.info(
				`Hint: Look for "${selectedHintWord[0]}" to start "${selectedHintWord}"`,
				{
					position: 'top-center',
					autoClose: 5000,
				},
			);
			setSelectedHintWord(null);
			setHintUsed(true);
		} else {
			toast.warn('Please select a word to get a hint for.', {
				position: 'top-center',
				autoClose: 3000,
			});
		}
	};
	const handleWordSelect = (word: string) => {
		if (foundWords.some((fw) => fw.word === word)) {
			toast.info('This word has already been found!');
		} else if (hintUsed) {
			toast.warn('You have already used your hint for this game.');
		} else {
			setSelectedHintWord(word);
		}
	};
	const isCellFound = (rowIndex: number, colIndex: number) => {
		return foundWords.some((fw) =>
			fw.cells.some(([r, c]) => r === rowIndex && c === colIndex),
		);
	};
	const isCellHighlighted = (rowIndex: number, colIndex: number) => {
		if (!hintWord) return false;
		return puzzle!.grid[rowIndex][colIndex] === hintWord[0];
	};
	const getCellSize = () => {
		switch (difficulty) {
			case 'easy':
				return 50;
			case 'medium':
				return 40;
			case 'hard':
				return 30;
			default:
				return 40;
		}
	};
	const cellSize = getCellSize();
	if (!puzzle) return <div>Loading puzzle...</div>;
	return (
		<div className={styles.wordSearchGame}>
			<ToastContainer />
			<h1>Word Search Game</h1>
			<div className={styles.gameInfo}>
				<p>Difficulty: {difficulty}</p>
				<p>Time: {formatTime(timer)}</p>
				<p>
					Found Words: {foundWords.length} / {puzzle?.words.length}
				</p>
				{gameCompleted && <p>Score: {calculateScore()}</p>}
				<button onClick={() => setIsGuideOpen(true)}>How to Play</button>
			</div>
			<div className={styles.wordList}>
				<h3>Words to Find:</h3>
				<ul>
					{puzzle.words.map((word, index) => (
						<li
							key={index}
							className={`${
								foundWords.some((fw) => fw.word === word)
									? styles.found
									: ''
							}
                                        ${
															selectedHintWord === word
																? styles.selected
																: ''
														}`}
							onClick={() => handleWordSelect(word)}>
							{word}
						</li>
					))}
				</ul>
			</div>
			<div className={styles.gameBoardContainer}>
				<div
					className={styles.gameBoard}
					style={{
						gridTemplateColumns: `repeat(${puzzle.grid[0].length}, ${cellSize}px)`,
						gridTemplateRows: `repeat(${puzzle.grid.length}, ${cellSize}px)`,
						gap: `${
							difficulty === 'easy'
								? 30
								: difficulty === 'medium'
								? 15
								: 10
						}px`,
					}}>
					{puzzle.grid.map((row, rowIndex) =>
						row.map((cell, colIndex) => (
							<div
								key={`${rowIndex}-${colIndex}`}
								className={`${styles.cell}
                                    ${
													selectedCells.some(
														([r, c]) =>
															r === rowIndex && c === colIndex,
													)
														? styles.selected
														: ''
												}
                                    ${
													isCellFound(rowIndex, colIndex)
														? styles.found
														: ''
												}
                                    ${
													isCellHighlighted(rowIndex, colIndex)
														? styles.highlighted
														: ''
												}`}
								style={{
									width: `${cellSize}px`,
									height: `${cellSize}px`,
									fontSize: `${cellSize * 0.6}px`,
								}}
								onMouseDown={() =>
									handleCellMouseDown(rowIndex, colIndex)
								}
								onMouseEnter={() =>
									handleCellMouseEnter(rowIndex, colIndex)
								}>
								{cell}
							</div>
						)),
					)}
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
export default WordSearchGame;
