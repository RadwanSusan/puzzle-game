// src\services\rewardService.ts
import User from '../models/User';
interface Achievement {
	id: string;
	name: string;
	description: string;
}
const achievements: Achievement[] = [
	{
		id: 'firstPuzzle',
		name: 'Puzzle Novice',
		description: 'Complete your first puzzle',
	},
	{
		id: 'tenPuzzles',
		name: 'Puzzle Enthusiast',
		description: 'Complete 10 puzzles',
	},
	{
		id: 'hundredPuzzles',
		name: 'Puzzle Master',
		description: 'Complete 100 puzzles',
	},
	{
		id: 'dailyStreak7',
		name: 'Weekly Warrior',
		description: 'Complete daily challenges for 7 days in a row',
	},
	{
		id: 'allTypes',
		name: 'Jack of All Puzzles',
		description: 'Complete at least one of each puzzle type',
	},
	{
		id: 'speedDemon',
		name: 'Speed Demon',
		description: 'Complete any puzzle in under 1 minute',
	},
	{
		id: 'perfectScore',
		name: 'Perfect Score',
		description: 'Achieve a perfect score in any puzzle',
	},
];
export async function checkAchievements(
	userId: string,
): Promise<Achievement[]> {
	const user = await User.findById(userId);
	if (!user) throw new Error('User not found');
	const newAchievements: Achievement[] = [];
	if (
		user.statistics.totalPuzzlesSolved >= 1 &&
		!user.statistics.achievements.includes('firstPuzzle')
	) {
		newAchievements.push(achievements.find((a) => a.id === 'firstPuzzle')!);
		user.statistics.achievements.push('firstPuzzle');
	}
	if (
		user.statistics.totalPuzzlesSolved >= 10 &&
		!user.statistics.achievements.includes('tenPuzzles')
	) {
		newAchievements.push(achievements.find((a) => a.id === 'tenPuzzles')!);
		user.statistics.achievements.push('tenPuzzles');
	}
	if (
		user.statistics.totalPuzzlesSolved >= 100 &&
		!user.statistics.achievements.includes('hundredPuzzles')
	) {
		newAchievements.push(
			achievements.find((a) => a.id === 'hundredPuzzles')!,
		);
		user.statistics.achievements.push('hundredPuzzles');
	}
	await user.save();
	return newAchievements;
}
