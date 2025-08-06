import React, { useState } from 'react';
import {
	Input,
	PasswordInput,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '@/utils/api';
import { API_ENDPOINTS } from '@/constants/api';

import styles from './reset-password.module.css';

interface ResetPasswordResponse {
	success: boolean;
	message: string;
}

export const ResetPasswordPage: React.FC = () => {
	const [password, setPassword] = useState('');
	const [token, setToken] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!password.trim() || !token.trim()) {
			setError('Пожалуйста, заполните все поля');
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await apiRequest<ResetPasswordResponse>(
				API_ENDPOINTS.RESET_PASSWORD,
				{
					method: 'POST',
					body: JSON.stringify({
						password,
						token,
					}),
				}
			);

			console.log('Password reset successful:', response);

			// При успешном сбросе пароля перенаправляем на страницу входа
			navigate('/login', { replace: true });
		} catch (err) {
			console.error('Reset password error:', err);
			setError(
				err instanceof Error
					? err.message
					: 'Произошла ошибка при сбросе пароля'
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className={styles.wrapper}>
			<form className={styles.form} onSubmit={handleSubmit}>
				<h1 className='text text_type_main-medium mb-6'>
					Восстановление пароля
				</h1>
				{error && (
					<div
						className='text text_type_main-default mb-4'
						style={{ color: 'red' }}>
						{error}
					</div>
				)}
				<PasswordInput
					value={password}
					name='password'
					placeholder='Введите новый пароль'
					onChange={(e) => setPassword(e.target.value)}
					extraClass='mb-6'
					icon='ShowIcon'
				/>
				<Input
					type='text'
					placeholder='Введите код из письма'
					value={token}
					name='token'
					onChange={(e) => setToken(e.target.value)}
					extraClass='mb-6'
				/>
				<Button
					htmlType='submit'
					type='primary'
					size='medium'
					extraClass='mb-20'>
					{isLoading ? 'Сохранение...' : 'Сохранить'}
				</Button>
				<div className={styles.footerLinks}>
					<p className='text text_type_main-default text_color_inactive'>
						Вспомнили пароль?{' '}
						<Link to='/login' className={styles.link}>
							Войти
						</Link>
					</p>
				</div>
			</form>
		</main>
	);
};
