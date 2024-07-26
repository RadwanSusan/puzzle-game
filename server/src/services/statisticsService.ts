// src\services\statisticsService.ts
import User, { PuzzleType } from '../models/User';
export async function updateStatistics(
	userId: string,
	puzzleType: PuzzleType,
	time: number,
	isDaily: boolean = false,
): Promise<void> {
	const user = await User.findById(userId);
	if (!user) throw new Error('User not found');
	// user.statistics.totalPuzzlesSolved += 1;
	// user.statistics.averageTime =
	// 	(user.statistics.averageTime * (user.statistics.totalPuzzlesSolved - 1) +
	// 		time) /
	// 	user.statistics.totalPuzzlesSolved;
	// if (time < user.statistics.bestTime) user.statistics.bestTime = time;
	// const puzzleTypeStats = user.statistics.puzzleTypeStats[puzzleType];
	// puzzleTypeStats.solved += 1;
	// puzzleTypeStats.averageTime =
	// 	(puzzleTypeStats.averageTime * (puzzleTypeStats.solved - 1) + time) /
	// 	puzzleTypeStats.solved;
	// if (isDaily) user.statistics.dailyChallengesCompleted += 1;
	// await user.save();
}
