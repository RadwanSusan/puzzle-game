import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
export async function getProfile(req: AuthRequest, res: Response) {
	try {
		const user = await User.findById(req.user?.id).select('-password');
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.json(user);
	} catch (error) {
		console.error('Error fetching profile:', error);
		res.status(500).json({ message: 'Error fetching profile' });
	}
}
export async function updateProfile(req: AuthRequest, res: Response) {
	try {
		const { email } = req.body;
		const user = await User.findByIdAndUpdate(
			req.user?.id,
			{ email },
			{ new: true },
		).select('-password');
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.json(user);
	} catch (error) {
		console.error('Error updating profile:', error);
		res.status(500).json({ message: 'Error updating profile' });
	}
}
export async function getStatistics(req: AuthRequest, res: Response) {
	try {
		const user = await User.findById(req.user?.id).select('statistics');
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.json(user.statistics);
	} catch (error) {
		console.error('Error fetching statistics:', error);
		res.status(500).json({ message: 'Error fetching statistics' });
	}
}
