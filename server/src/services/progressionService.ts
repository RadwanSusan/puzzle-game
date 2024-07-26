// src\services\progressionService.ts
import User from '../models/User';
interface ProgressionData {
	score: number;
	difficulty: string;
	puzzleType: string;
	time: number;
}
export async function updateUserProgress(
	userId: string,
	data: ProgressionData,
): Promise<string> {
	const user = await User.findById(userId);
	if (!user) throw new Error('User not found');
	user.completedPuzzles = (user.completedPuzzles || 0) + 1;
	user.totalScore = (user.totalScore || 0) + data.score;
	if (!user.puzzleTypeProgress) user.puzzleTypeProgress = {};
	if (!user.puzzleTypeProgress[data.puzzleType]) {
		user.puzzleTypeProgress[data.puzzleType] = {
			completedPuzzles: 0,
			currentDifficulty: 'easy',
			averageTime: 0,
		};
	}
	const progress = user.puzzleTypeProgress[data.puzzleType];
	progress.completedPuzzles += 1;
	progress.averageTime =
		(progress.averageTime * (progress.completedPuzzles - 1) + data.time) /
		progress.completedPuzzles;
	let newDifficulty = progress.currentDifficulty;
	if (progress.completedPuzzles % 5 === 0) {
		const performanceRatio = data.score / data.time;
		if (performanceRatio > 2 && newDifficulty !== 'hard') {
			newDifficulty = newDifficulty === 'easy' ? 'medium' : 'hard';
		} else if (performanceRatio < 0.5 && newDifficulty !== 'easy') {
			newDifficulty = newDifficulty === 'hard' ? 'medium' : 'easy';
		}
	}
	progress.currentDifficulty = newDifficulty;
	await user.save();
	return newDifficulty;
}
