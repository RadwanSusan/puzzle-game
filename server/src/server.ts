import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import puzzleRoutes from './routes/puzzleRoutes';
import profileRoutes from './routes/profileRoutes';
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI as string);
const connection = mongoose.connection;
connection.once('open', () => {
	console.log('MongoDB database connection established successfully');
});
app.use('/api/auth', authRoutes);
app.use('/api', puzzleRoutes);
app.use('/api/user', profileRoutes);
app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
