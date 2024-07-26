// src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
export interface PuzzleTypeProgress {
	completedPuzzles: number;
	currentDifficulty: string;
	averageTime: number;
}
export type PuzzleType = 'number' | 'wordSearch' | 'crossword';
export interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	completedPuzzles: number;
	totalScore: number;
	currentDifficulty: string;
	achievements: string[];
	puzzleTypeProgress: {
		[key: string]: PuzzleTypeProgress;
	};
	statistics: {
		totalPuzzlesSolved: number;
		averageTime: number;
		bestTime: number;
		puzzleTypeStats: {
			[key in PuzzleType]: { solved: number; averageTime: number };
		};
		dailyChallengesCompleted: number;
		achievements: string[];
	};
	comparePassword(candidatePassword: string): Promise<boolean>;
}
const UserSchema: Schema = new Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	completedPuzzles: { type: Number, default: 0 },
	totalScore: { type: Number, default: 0 },
	currentDifficulty: { type: String, default: 'easy' },
	achievements: [String],
	puzzleTypeProgress: {
		type: Map,
		of: {
			completedPuzzles: Number,
			currentDifficulty: String,
			averageTime: Number,
		},
		default: {},
	},
	statistics: {
		totalPuzzlesSolved: { type: Number, default: 0 },
		averageTime: { type: Number, default: 0 },
		bestTime: { type: Number, default: Infinity },
		puzzleTypeStats: {
			number: {
				solved: { type: Number, default: 0 },
				averageTime: { type: Number, default: 0 },
			},
			wordSearch: {
				solved: { type: Number, default: 0 },
				averageTime: { type: Number, default: 0 },
			},
			crossword: {
				solved: { type: Number, default: 0 },
				averageTime: { type: Number, default: 0 },
			},
		},
		dailyChallengesCompleted: { type: Number, default: 0 },
		achievements: [String],
	},
});
UserSchema.pre<IUser>('save', async function (next) {
	if (!this.isModified('password')) return next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});
UserSchema.methods.comparePassword = async function (
	candidatePassword: string,
): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
};
export default mongoose.model<IUser>('User', UserSchema);
