// src/components/Auth.tsx
import React, { useState } from 'react';
import axios from 'axios';
import './css/Auth.css';
interface AuthProps {
	onAuthSuccess: (token: string) => void;
}
const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
	const [isLogin, setIsLogin] = useState(true);
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);
		try {
			const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
			const payload = isLogin
				? { username, password }
				: { username, email, password };
			const response = await axios.post(endpoint, payload);
			localStorage.setItem('token', response.data.token);
			onAuthSuccess(response.data.token);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				setError(
					error.response.data.message ||
						'An error occurred during authentication',
				);
			} else {
				setError('An unexpected error occurred');
			}
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className='authContainer'>
			<h2>{isLogin ? 'Login' : 'Register'}</h2>
			{error && <div className='errorMessage'>{error}</div>}
			<form
				onSubmit={handleSubmit}
				className='authForm'>
				<input
					type='text'
					placeholder='Username'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
				{!isLogin && (
					<input
						type='email'
						placeholder='Email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				)}
				<input
					type='password'
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button
					type='submit'
					disabled={isLoading}>
					{isLoading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
				</button>
			</form>
			<div className='switchMode'>
				<button onClick={() => setIsLogin(!isLogin)}>
					{isLogin ? 'Need to register?' : 'Already have an account?'}
				</button>
			</div>
		</div>
	);
};
export default Auth;
