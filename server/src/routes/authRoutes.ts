import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { register, login } from '../controllers/authController';
const router = express.Router();
router.post(
	'/register',
	[
		body('username').isLength({ min: 3 }),
		body('email').isEmail(),
		body('password').isLength({ min: 6 }),
	],
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	register,
);
router.post(
	'/login',
	[body('username').exists(), body('password').exists()],
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	login,
);
export default router;
