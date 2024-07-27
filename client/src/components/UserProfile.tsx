import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/UserProfile.css';
interface UserProfileProps {
	token: string;
}
interface UserProfile {
	username: string;
	email: string;
	statistics: {
		totalPuzzlesSolved: number;
		averageTime: number;
		bestTime: number;
		puzzleTypeStats: {
			number: { solved: number; averageTime: number };
			wordSearch: { solved: number; averageTime: number };
			crossword: { solved: number; averageTime: number };
		};
		dailyChallengesCompleted: number;
		achievements: string[];
	};
}
const UserProfile: React.FC<UserProfileProps> = ({ token }) => {
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [error, setError] = useState('');
	useEffect(() => {
		fetchProfile();
	}, []);
	const fetchProfile = async () => {
		try {
			const response = await axios.get('/api/user/profile', {
				headers: { Authorization: `Bearer ${token}` },
			});
			setProfile(response.data);
		} catch (error) {
			console.error('Error fetching user profile:', error);
			setError('Failed to fetch profile');
		}
	};
	if (error) return <div className='error'>{error}</div>;
	if (!profile) return <div>Loading profile...</div>;
	return (
		<div className='user-profile'>
			<h2>{profile.username}'s Profile</h2>
			<div className='profile-info'>
				<div>
					<p>Email: {profile.email}</p>
				</div>
			</div>
			<div className='stats'>
				<div className='stat-card'>
					<h3>Total Puzzles Solved</h3>
					<p className='stat-value'>
						{profile.statistics.totalPuzzlesSolved}
					</p>
				</div>
				<div className='stat-card'>
					<h3>Average Time</h3>
					<p className='stat-value'>
						{profile.statistics.averageTime.toFixed(2)}s
					</p>
				</div>
				<div className='stat-card'>
					<h3>Best Time</h3>
					<p className='stat-value'>{profile.statistics.bestTime}s</p>
				</div>
				<div className='stat-card'>
					<h3>Daily Challenges Completed</h3>
					<p className='stat-value'>
						{profile.statistics.dailyChallengesCompleted}
					</p>
				</div>
			</div>
			<div className='puzzle-type-stats'>
				<h3>Puzzle Type Stats</h3>
				<div className='stats'>
					<div className='stat-card'>
						<h4>Number Puzzles</h4>
						<p>
							Solved: {profile.statistics.puzzleTypeStats.number.solved}
						</p>
						<p>
							Average Time:{' '}
							{profile.statistics.puzzleTypeStats.number.averageTime.toFixed(
								2,
							)}
							s
						</p>
					</div>
					<div className='stat-card'>
						<h4>Word Search</h4>
						<p>
							Solved:{' '}
							{profile.statistics.puzzleTypeStats.wordSearch.solved}
						</p>
						<p>
							Average Time:{' '}
							{profile.statistics.puzzleTypeStats.wordSearch.averageTime.toFixed(
								2,
							)}
							s
						</p>
					</div>
					<div className='stat-card'>
						<h4>Crossword</h4>
						<p>
							Solved:{' '}
							{profile.statistics.puzzleTypeStats.crossword.solved}
						</p>
						<p>
							Average Time:{' '}
							{profile.statistics.puzzleTypeStats.crossword.averageTime.toFixed(
								2,
							)}
							s
						</p>
					</div>
				</div>
			</div>
			<div className='achievements'>
				<h3>Achievements</h3>
				<div className='achievement-list'>
					{profile.statistics.achievements.map((achievement, index) => (
						<div
							key={index}
							className='achievement'>
							<div className='achievement-icon'>🏆</div>
							<p>{achievement}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
export default UserProfile;
