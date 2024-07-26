// src/components/Leaderboard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Leaderboard.css';
interface LeaderboardEntry {
	username: string;
	score: number;
	timestamp: string;
}
const Leaderboard: React.FC = () => {
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
	const [puzzleType, setPuzzleType] = useState<
		'number' | 'wordsearch' | 'crossword'
	>('number');
	const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(
		'easy',
	);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		fetchLeaderboard();
	}, [puzzleType, difficulty]);
	const fetchLeaderboard = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(
				`/api/leaderboard?puzzleType=${puzzleType}&difficulty=${difficulty}`,
			);
			setLeaderboard(response.data);
		} catch (error) {
			console.error('Error fetching leaderboard:', error);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className='leaderboardContainer'>
			<h2 className='leaderboardTitle'>Leaderboard</h2>
			<div className='filters'>
				<select
					className='filterSelect'
					value={puzzleType}
					onChange={(e) => {
						if (e.target.value === 'number') {
							setPuzzleType('number');
						} else if (e.target.value === 'wordsearch') {
							setPuzzleType('wordsearch');
						} else if (e.target.value === 'crossword') {
							setPuzzleType('crossword');
						}
					}}>
					<option value='number'>Number Puzzle</option>
					<option value='wordsearch'>Word Search</option>
					<option value='crossword'>Crossword</option>
				</select>
				<select
					className='filterSelect'
					value={difficulty}
					onChange={(e) =>
						setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')
					}>
					<option value='easy'>Easy</option>
					<option value='medium'>Medium</option>
					<option value='hard'>Hard</option>
				</select>
			</div>
			{isLoading ? (
				<div className='loadingSpinner'>Loading...</div>
			) : (
				<table className='leaderboardTable'>
					<thead>
						<tr>
							<th>Rank</th>
							<th>Username</th>
							<th>Score</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{leaderboard.map((entry, index) => (
							<tr
								key={index}
								className={index < 3 ? `top${index + 1}` : ''}>
								<td>{index + 1}</td>
								<td>{entry.username}</td>
								<td>{entry.score}</td>
								<td>
									{new Date(entry.timestamp).toLocaleDateString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};
export default Leaderboard;
