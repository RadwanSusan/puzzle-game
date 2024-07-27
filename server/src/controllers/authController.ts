import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
export async function register(req: Request, res: Response) {
	try {
		const { username, email, password } = req.body;
		let user = await User.findOne({ $or: [{ email }, { username }] });
		if (user) {
			return res.status(400).json({ message: 'User already exists' });
		}
		user = new User({ username, email, password });
		await user.save();
		const token = jwt.sign(
			{ id: user._id, username: user.username },
			process.env.JWT_SECRET as string,
			{ expiresIn: '1d' },
		);
		res.status(201).json({ token });
	} catch (error) {
		res.status(500).json({ message: 'Error in registration' });
	}
}
export async function login(req: Request, res: Response) {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}
		const token = jwt.sign(
			{ id: user._id, username: user.username },
			process.env.JWT_SECRET as string,
			{ expiresIn: '1d' },
		);
		res.json({ token });
	} catch (error) {
		res.status(500).json({ message: 'Error in login' });
	}
}
