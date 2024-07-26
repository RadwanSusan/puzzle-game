// src/components/UserProfile.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
	const [email, setEmail] = useState('');
	const [isEditing, setIsEditing] = useState(false);
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
			setEmail(response.data.email);
		} catch (error) {
			console.error('Error fetching user profile:', error);
			setError('Failed to fetch profile');
		}
	};
	const handleUpdateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axios.put(
				'/api/user/profile',
				{ email },
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			setProfile(response.data);
			setIsEditing(false);
		} catch (error) {
			console.error('Error updating profile:', error);
			setError('Failed to update profile');
		}
	};
	if (error) return <div className='error'>{error}</div>;
	if (!profile) return <div>Loading profile...</div>;
	return (
		<div className='user-profile'>
			<h2>{profile.username}'s Profile</h2>
			{isEditing ? (
				<form onSubmit={handleUpdateProfile}>
					<input
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<button type='submit'>Save</button>
					<button onClick={() => setIsEditing(false)}>Cancel</button>
				</form>
			) : (
				<div>
					<p>Email: {profile.email}</p>
					<button onClick={() => setIsEditing(true)}>Edit Email</button>
				</div>
			)}
			<div className='statistics'>
				<h3>Statistics</h3>
				<p>Total Puzzles Solved: {profile.statistics.totalPuzzlesSolved}</p>
				<p>
					Average Time: {profile.statistics.averageTime.toFixed(2)} seconds
				</p>
				<p>Best Time: {profile.statistics.bestTime} seconds</p>
				<p>
					Daily Challenges Completed:{' '}
					{profile.statistics.dailyChallengesCompleted}
				</p>
				<h4>Puzzle Type Stats:</h4>
				<ul>
					<li>
						Number Puzzles:{' '}
						{profile.statistics.puzzleTypeStats.number.solved} solved,
						{profile.statistics.puzzleTypeStats.number.averageTime.toFixed(
							2,
						)}{' '}
						seconds average time
					</li>
					<li>
						Word Search:{' '}
						{profile.statistics.puzzleTypeStats.wordSearch.solved} solved,
						{profile.statistics.puzzleTypeStats.wordSearch.averageTime.toFixed(
							2,
						)}{' '}
						seconds average time
					</li>
					<li>
						Crossword:{' '}
						{profile.statistics.puzzleTypeStats.crossword.solved} solved,
						{profile.statistics.puzzleTypeStats.crossword.averageTime.toFixed(
							2,
						)}{' '}
						seconds average time
					</li>
				</ul>
			</div>
			<div className='achievements'>
				<h3>Achievements</h3>
				<ul>
					{profile.statistics.achievements.map((achievement, index) => (
						<li key={index}>{achievement}</li>
					))}
				</ul>
			</div>
		</div>
	);
};
export default UserProfile;
