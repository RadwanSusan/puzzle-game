import React, { useEffect, useState } from 'react';
import Auth from './components/Auth';
import DifficultySelector from './components/DifficultySelector';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import Tutorial from './components/Tutorial';
import UserProfile from './components/UserProfile';
import Navigation from './components/Navigation';
import styles from './App.module.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
type GameState =
	| 'auth'
	| 'tutorial'
	| 'selecting-mode'
	| 'selecting-difficulty'
	| 'playing'
	| 'leaderboard'
	| 'profile'
	| 'timed'
	| 'daily';
type Difficulty = 'easy' | 'medium' | 'hard';
type GameType = 'number' | 'wordsearch' | 'crossword' | 'daily';
const App: React.FC = () => {
	const [gameState, setGameState] = useState<GameState>('auth');
	const [difficulty, setDifficulty] = useState<Difficulty>('easy');
	const [gameType, setGameType] = useState<GameType>('number');
	const [token, setToken] = useState<string | null>(null);
	useEffect(() => {
		const storedToken = localStorage.getItem('token');
		if (storedToken) {
			setToken(storedToken);
			setGameState('selecting-mode');
		}
	}, []);
	const handleAuthSuccess = (newToken: string) => {
		setToken(newToken);
		setGameState('tutorial');
	};
	const handleLogout = () => {
		localStorage.removeItem('token');
		setToken(null);
		setGameState('auth');
	};
	const handleTutorialComplete = () => {
		setGameState('selecting-mode');
	};
	const handleSelectGameType = (selectedGameType: GameType) => {
		setGameType(selectedGameType);
		setGameState('selecting-difficulty');
	};
	const handleSelectDifficulty = (selectedDifficulty: Difficulty) => {
		setDifficulty(selectedDifficulty);
		setGameState('playing');
	};
	const renderGameModeSelection = () => (
		<div className={styles.selectionContainer}>
			<h2>Select Game Mode</h2>
			<div className={styles.buttonGrid}>
				<button onClick={() => handleSelectGameType('number')}>
					Number Puzzle
				</button>
				<button onClick={() => handleSelectGameType('wordsearch')}>
					Word Search
				</button>
				<button onClick={() => handleSelectGameType('crossword')}>
					Crossword
				</button>
			</div>
		</div>
	);
	return (
		<div className={styles.app}>
			<ToastContainer />
			{token && (
				<Navigation
					onNewGame={() => setGameState('selecting-mode')}
					onTimedChallenge={() => setGameState('timed')}
					onDailyChallenge={() => setGameState('playing')}
					onLeaderboard={() => setGameState('leaderboard')}
					onProfile={() => setGameState('profile')}
					onLogout={handleLogout}
				/>
			)}
			<div
				key={gameState}
				className={styles.fadeIn}>
				{gameState === 'auth' && <Auth onAuthSuccess={handleAuthSuccess} />}
				{gameState === 'tutorial' && (
					<Tutorial onComplete={handleTutorialComplete} />
				)}
				{gameState === 'selecting-mode' && renderGameModeSelection()}
				{gameState === 'selecting-difficulty' && (
					<DifficultySelector
						onSelectDifficulty={handleSelectDifficulty}
					/>
				)}
				{gameState === 'playing' && (
					<Game
						difficulty={difficulty}
						token={token as string}
						gameType={gameType}
					/>
				)}
				{gameState === 'leaderboard' && <Leaderboard />}
				{gameState === 'profile' && <UserProfile token={token as string} />}
			</div>
		</div>
	);
};
export default App;
