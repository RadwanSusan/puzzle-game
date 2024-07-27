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
