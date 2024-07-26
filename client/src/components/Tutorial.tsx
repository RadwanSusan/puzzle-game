// src\components\Tutorial.tsx
import React, { useState } from 'react';
import './css/Tutorial.css';
interface TutorialProps {
	onComplete: () => void;
}
const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
	const [step, setStep] = useState(0);
	const tutorialSteps = [
		{
			title: 'Welcome to the Puzzle Game!',
			content:
				'This tutorial will guide you through the various puzzle types and features of our game.',
		},
		{
			title: 'Number Puzzle',
			content:
				'In the Number Puzzle, fill the grid with numbers so that each row, column, and section contains all numbers without repetition. Start with the given numbers and use logic to deduce the rest.',
		},
		{
			title: 'Word Search',
			content:
				'In Word Search, find hidden words in a grid of letters. Words can be horizontal, vertical, or diagonal. Click and drag to select words when you find them.',
		},
		{
			title: 'Crossword',
			content:
				'Solve the Crossword by filling in words based on the given clues. The words intersect, sharing some letters. Click on a cell to select it, then type your answer.',
		},
		{
			title: 'Difficulty Levels',
			content:
				'You can choose from three difficulty levels: Easy, Medium, and Hard. As you improve, challenge yourself with harder puzzles!',
		},
		{
			title: 'Daily Challenge',
			content:
				"Don't miss the Daily Challenge! It's a unique puzzle available each day for all players. Compare your score with others on the daily leaderboard.",
		},
		{
			title: 'Hints and Checking',
			content:
				'Stuck on a puzzle? Use the "Get Hint" button for a helpful clue. You can also use the "Check Solution" button to see which cells are correct or incorrect.',
		},
		{
			title: 'Leaderboards',
			content:
				'Compare your scores with other players on our leaderboards. You can view rankings for each puzzle type and difficulty level.',
		},
		{
			title: 'Your Profile',
			content:
				"Visit your profile to track your progress, view your statistics, and see the achievements you've unlocked. Keep playing to improve your skills and earn more achievements!",
		},
		{
			title: 'Ready to play?',
			content:
				"You're now ready to start solving puzzles! Remember, practice makes perfect. Good luck and have fun!",
		},
	];
	return (
		<div className='tutorial'>
			<h2>{tutorialSteps[step].title}</h2>
			<p>{tutorialSteps[step].content}</p>
			<div className='tutorial-navigation'>
				<button
					onClick={() => setStep(step - 1)}
					disabled={step === 0}>
					Previous
				</button>
				{step < tutorialSteps.length - 1 ? (
					<button onClick={() => setStep(step + 1)}>Next</button>
				) : (
					<button onClick={onComplete}>Start Playing</button>
				)}
			</div>
			<div className='tutorial-progress'>
				{tutorialSteps.map((_, index) => (
					<div
						key={index}
						className={`tutorial-progress-dot ${
							index === step ? 'active' : ''
						}`}
					/>
				))}
			</div>
		</div>
	);
};

export default Tutorial;
