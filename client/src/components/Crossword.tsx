// src\components\Crossword.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Crossword.css';
interface CrosswordCell {
	letter: string;
	number?: number;
}
interface CrosswordClue {
	number: number;
	direction: 'across' | 'down';
	clue: string;
}
interface CrosswordProps {
	token: string;
}
const Crossword: React.FC<CrosswordProps> = ({ token }) => {
	const [grid, setGrid] = useState<CrosswordCell[][]>([]);
	const [clues, setClues] = useState<CrosswordClue[]>([]);
	const [userInput, setUserInput] = useState<string[][]>([]);
	useEffect(() => {
		fetchCrosswordPuzzle();
	}, []);
	const fetchCrosswordPuzzle = async () => {
		try {
			const response = await axios.get('/api/crossword', {
				headers: { Authorization: `Bearer ${token}` },
			});
			setGrid(response.data.grid);
			setClues(response.data.clues);
			setUserInput(
				response.data.grid.map((row: CrosswordCell[]) => row.map(() => '')),
			);
		} catch (error) {
			console.error('Error fetching crossword puzzle:', error);
		}
	};
	const handleInputChange = (
		rowIndex: number,
		colIndex: number,
		value: string,
	) => {
		const newUserInput = [...userInput];
		newUserInput[rowIndex][colIndex] = value.toUpperCase();
		setUserInput(newUserInput);
	};
	const handleSubmit = async () => {
		try {
			const response = await axios.post(
				'/api/crossword/submit',
				{ solution: userInput },
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			alert(response.data.message);
		} catch (error) {
			console.error('Error submitting crossword solution:', error);
			alert('Error submitting solution');
		}
	};
	return (
		<div className='crossword'>
			<h2>Crossword Puzzle</h2>
			<div className='crossword-grid'>
				{grid.map((row, rowIndex) => (
					<div
						key={rowIndex}
						className='row'>
						{row.map((cell, colIndex) => (
							<div
								key={colIndex}
								className='cell'>
								{cell.number && (
									<span className='cell-number'>{cell.number}</span>
								)}
								<input
									type='text'
									maxLength={1}
									value={userInput[rowIndex][colIndex]}
									onChange={(e) =>
										handleInputChange(
											rowIndex,
											colIndex,
											e.target.value,
										)
									}
									disabled={cell.letter === ''}
								/>
							</div>
						))}
					</div>
				))}
			</div>
			<div className='clues'>
				<div className='across'>
					<h3>Across</h3>
					{clues
						.filter((clue) => clue.direction === 'across')
						.map((clue) => (
							<p key={clue.number}>
								{clue.number}. {clue.clue}
							</p>
						))}
				</div>
				<div className='down'>
					<h3>Down</h3>
					{clues
						.filter((clue) => clue.direction === 'down')
						.map((clue) => (
							<p key={clue.number}>
								{clue.number}. {clue.clue}
							</p>
						))}
				</div>
			</div>
			<button onClick={handleSubmit}>Submit Solution</button>
		</div>
	);
};
export default Crossword;
