// src/components/DifficultySelector.tsx
import React from 'react';
import styles from './css/DifficultySelector.module.css';

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultySelectorProps {
	onSelectDifficulty: (difficulty: Difficulty) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
	onSelectDifficulty,
}) => {
	return (
		<div className={styles.difficultySelector}>
			<h2>Select Difficulty</h2>
			<div className={styles.buttonGrid}>
				<button onClick={() => onSelectDifficulty('easy')}>Easy</button>
				<button onClick={() => onSelectDifficulty('medium')}>Medium</button>
				<button onClick={() => onSelectDifficulty('hard')}>Hard</button>
			</div>
		</div>
	);
};

export default DifficultySelector;
