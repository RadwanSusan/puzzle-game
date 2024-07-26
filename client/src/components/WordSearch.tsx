// src\components\WordSearch.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/WordSearch.css';
interface WordSearchProps {
	token: string;
}
const WordSearch: React.FC<WordSearchProps> = ({ token }) => {
	const [grid, setGrid] = useState<string[][]>([]);
	const [words, setWords] = useState<string[]>([]);
	const [foundWords, setFoundWords] = useState<string[]>([]);
	const [selection, setSelection] = useState<[number, number][]>([]);
	useEffect(() => {
		fetchWordSearchPuzzle();
	}, []);
	const fetchWordSearchPuzzle = async () => {
		try {
			const response = await axios.get('/api/wordsearch', {
				headers: { Authorization: `Bearer ${token}` },
			});
			setGrid(response.data.grid);
			setWords(response.data.words);
		} catch (error) {
			console.error('Error fetching word search puzzle:', error);
		}
	};
	const handleCellClick = (row: number, col: number) => {
		if (selection.length === 0) {
			setSelection([[row, col]]);
		} else if (selection.length === 1) {
			const [startRow, startCol] = selection[0];
			setSelection([
				[startRow, startCol],
				[row, col],
			]);
			checkSelection(startRow, startCol, row, col);
		} else {
			setSelection([[row, col]]);
		}
	};
	const checkSelection = (
		startRow: number,
		startCol: number,
		endRow: number,
		endCol: number,
	) => {
		const word = getSelectedWord(startRow, startCol, endRow, endCol);
		if (words.includes(word) && !foundWords.includes(word)) {
			setFoundWords([...foundWords, word]);
		}
		if (
			words.includes(word.split('').reverse().join('')) &&
			!foundWords.includes(word.split('').reverse().join(''))
		) {
			setFoundWords([...foundWords, word.split('').reverse().join('')]);
		}
	};
	const getSelectedWord = (
		startRow: number,
		startCol: number,
		endRow: number,
		endCol: number,
	): string => {
		let word = '';
		const rowStep = Math.sign(endRow - startRow);
		const colStep = Math.sign(endCol - startCol);
		let currentRow = startRow;
		let currentCol = startCol;
		while (
			currentRow !== endRow + rowStep ||
			currentCol !== endCol + colStep
		) {
			word += grid[currentRow][currentCol];
			currentRow += rowStep;
			currentCol += colStep;
		}
		return word;
	};
	return (
		<div className='word-search'>
			<h2>Word Search</h2>
			<div className='grid'>
				{grid.map((row, rowIndex) => (
					<div
						key={rowIndex}
						className='row'>
						{row.map((cell, colIndex) => (
							<button
								key={colIndex}
								onClick={() => handleCellClick(rowIndex, colIndex)}
								className={
									selection.some(
										([r, c]) => r === rowIndex && c === colIndex,
									)
										? 'selected'
										: ''
								}>
								{cell}
							</button>
						))}
					</div>
				))}
			</div>
			<div className='word-list'>
				<h3>Words to Find:</h3>
				<ul>
					{words.map((word, index) => (
						<li
							key={index}
							className={foundWords.includes(word) ? 'found' : ''}>
							{word}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
export default WordSearch;
