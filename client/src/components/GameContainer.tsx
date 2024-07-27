import React, { useState } from 'react';
import WordSearchGame from './WordSearchGame';
import NumberPuzzleGame from './NumberPuzzleGame';
import CrosswordGame from './CrosswordGame';
interface GameContainerProps {
	token: string;
}
const GameContainer: React.FC<GameContainerProps> = ({ token }) => {
	const [gameType, setGameType] = useState<
		'wordsearch' | 'number' | 'crossword'
	>('wordsearch');
	const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(
		'medium',
	);
	const renderGame = () => {
		switch (gameType) {
			case 'wordsearch':
				return (
					<WordSearchGame
						difficulty={difficulty}
						token={token}
					/>
				);
			case 'number':
				return (
					<NumberPuzzleGame
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
		}
	};
	return (
		<div className='game-container'>
			<div className='game-controls'>
				<select
					value={gameType}
					onChange={(e) =>
						setGameType(
							e.target.value as 'wordsearch' | 'number' | 'crossword',
						)
					}>
					<option value='wordsearch'>Word Search</option>
					<option value='number'>Number Puzzle</option>
					<option value='crossword'>Crossword</option>
				</select>
				<select
					value={difficulty}
					onChange={(e) =>
						setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')
					}>
					<option value='easy'>Easy</option>
					<option value='medium'>Medium</option>
					<option value='hard'>Hard</option>
				</select>
			</div>
			{renderGame()}
		</div>
	);
};
export default GameContainer;
