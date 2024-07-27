import mongoose, { Schema, Document } from 'mongoose';
export interface IScore extends Document {
	username: string;
	score: number;
	difficulty: 'easy' | 'medium' | 'hard';
	puzzleType: 'number' | 'wordsearch' | 'crossword';
	timestamp: Date;
}
const ScoreSchema: Schema = new Schema({
	username: { type: String, required: true },
	score: { type: Number, required: true },
	difficulty: {
		type: String,
		enum: ['easy', 'medium', 'hard'],
		required: true,
	},
	puzzleType: {
		type: String,
		enum: ['number', 'wordsearch', 'crossword'],
		required: true,
	},
	timestamp: { type: Date, default: Date.now },
});
export default mongoose.model<IScore>('Score', ScoreSchema);
