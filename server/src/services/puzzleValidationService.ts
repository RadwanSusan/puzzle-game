import { IPuzzle } from '../models/Puzzle';
export function validatePuzzleSolution(
	puzzle: IPuzzle,
	userSolution: number[][],
): boolean {
	const size = puzzle.grid.length;
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			if (userSolution[i][j] === 0) {
				return false;
			}
		}
	}
	for (let i = 0; i < size; i++) {
		const rowSet = new Set();
		const colSet = new Set();
		for (let j = 0; j < size; j++) {
			rowSet.add(userSolution[i][j]);
			colSet.add(userSolution[j][i]);
		}
		if (rowSet.size !== size || colSet.size !== size) {
			return false;
		}
	}
	return true;
}
