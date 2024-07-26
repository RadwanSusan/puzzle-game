// src\models\Puzzle.ts
import mongoose, { Schema, Document } from 'mongoose';
export type PuzzleType = 'number' | 'wordsearch' | 'crossword';
export type Difficulty = 'easy' | 'medium' | 'hard';
export interface IPuzzle extends Document {
	type: PuzzleType;
	difficulty: Difficulty;
	grid: (number | string)[][];
	solution: (number | string)[][] | string[];
	date?: Date;
	words?: string[];
}
const PuzzleSchema: Schema = new Schema({
	type: {
		type: String,
		enum: ['number', 'wordsearch', 'crossword'],
		required: true,
	},
	difficulty: {
		type: String,
		enum: ['easy', 'medium', 'hard'],
		required: true,
	},
	grid: {
		type: [[Schema.Types.Mixed]],
		required: true,
	},
	solution: {
		type: Schema.Types.Mixed,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	words: [String],
});
export default mongoose.model<IPuzzle>('Puzzle', PuzzleSchema);
