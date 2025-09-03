import React, { useState } from 'react';
import {
	EmailInput,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '@/utils/api';
import { API_ENDPOINTS } from '@/constants/api';
import { ErrorMessage } from '@components/error-message/error-message';
import styles from './forgot-password.module.css';

interface ForgotPasswordResponse {
	success: boolean;
	message: string;
}

export const ForgotPasswordPage: React.FC = () => {
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim()) {
			setError('Пожалуйста, введите email');
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await apiRequest<ForgotPasswordResponse>(
				API_ENDPOINTS.FORGOT_PASSWORD,
				{
					method: 'POST',
					body: JSON.stringify({
						email,
					}),
				}
			);

			console.log('Password reset email sent:', response);

			// При успешном запросе перенаправляем на страницу reset-password
			navigate('/reset-password', {
				state: {
					canResetPassword: true,
				},
				replace: true,
			});
		} catch (err) {
			console.error('Forgot password error:', err);
			setError(
				err instanceof Error
					? err.message
					: 'Произошла ошибка при отправке письма'
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
				<ErrorMessage error={error} />
				<EmailInput
					value={email}
					name='email'
					placeholder='Укажите e-mail'
					onChange={(e) => setEmail(e.target.value)}
					extraClass='mb-6'
				/>
				<Button
					htmlType='submit'
					type='primary'
					size='medium'
					extraClass='mb-20'>
					{isLoading ? 'Отправка...' : 'Восстановить'}
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
