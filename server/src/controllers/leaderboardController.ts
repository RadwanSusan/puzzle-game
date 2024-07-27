import { Request, Response } from 'express';
import Score from '../models/Score';
export async function getDailyLeaderboard(req: Request, res: Response) {
	try {
		const date = new Date().toISOString().split('T')[0];
		const leaderboard = await Score.aggregate([
			{ $match: { date: date, isDaily: true } },
			{
				$group: {
					_id: '$username',
					totalScore: { $sum: '$score' },
					averageTime: { $avg: '$time' },
				},
			},
			{ $sort: { totalScore: -1, averageTime: 1 } },
			{ $limit: 10 },
		]);
		res.json(leaderboard);
	} catch (error) {
		console.error('Error fetching daily leaderboard:', error);
		res.status(500).json({ message: 'Error fetching daily leaderboard' });
	}
}
