import React, { useState, useEffect } from 'react';
import axios from 'axios';
interface ProfileProps {
	token: string;
}
interface Score {
	_id: string;
	score: number;
	difficulty: string;
	timestamp: string;
}
const Profile: React.FC<ProfileProps> = ({ token }) => {
	const [scores, setScores] = useState<Score[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	useEffect(() => {
		const fetchScores = async () => {
			try {
				const response = await axios.get('/api/scores', {
					headers: { Authorization: `Bearer ${token}` },
				});
				setScores(response.data);
				setLoading(false);
			} catch (error) {
				setError('Failed to fetch scores');
				setLoading(false);
			}
		};
		fetchScores();
	}, [token]);
	if (loading) return <div>Loading profile...</div>;
	if (error) return <div>{error}</div>;
	return (
		<div className='profile'>
			<h2>Your Profile</h2>
			<h3>Past Scores</h3>
			<table>
				<thead>
					<tr>
						<th>Date</th>
						<th>Difficulty</th>
						<th>Score</th>
					</tr>
				</thead>
				<tbody>
					{scores.map((score) => (
						<tr key={score._id}>
							<td>{new Date(score.timestamp).toLocaleDateString()}</td>
							<td>{score.difficulty}</td>
							<td>{score.score}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
export default Profile;
