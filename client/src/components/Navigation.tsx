// src/components/Navigation.tsx
import React from 'react';
import styles from './css/Navigation.module.css';
interface NavigationProps {
	onNewGame: () => void;
	onTimedChallenge: () => void;
	onDailyChallenge: () => void;
	onLeaderboard: () => void;
	onProfile: () => void;
	onLogout: () => void;
}
const Navigation: React.FC<NavigationProps> = ({
	onNewGame,
	onDailyChallenge,
	onLeaderboard,
	onProfile,
	onLogout,
}) => {
	return (
		<nav className={styles.navigation}>
			<button onClick={onNewGame}>New Game</button>
			<button onClick={onDailyChallenge}>Daily Challenge</button>
			<button onClick={onLeaderboard}>Leaderboard</button>
			<button onClick={onProfile}>Profile</button>
			<button onClick={onLogout}>Logout</button>
		</nav>
	);
};
export default Navigation;
