import React, { useState } from 'react';
import {
	Input,
	EmailInput,
	PasswordInput,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '@/utils/api';
import { API_ENDPOINTS } from '@/constants/api';

import styles from './register.module.css';

interface RegisterResponse {
	success: boolean;
	user: {
		email: string;
		name: string;
	};
	accessToken: string;
	refreshToken: string;
	message?: string;
}

export const RegisterPage: React.FC = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !email.trim() || !password.trim()) {
			setError('Пожалуйста, заполните все поля');
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await apiRequest<RegisterResponse>(
				API_ENDPOINTS.REGISTER,
				{
					method: 'POST',
					body: JSON.stringify({
						email,
						password,
						name,
					}),
				}
			);

			console.log('Registration successful:', response);
			// Сохраняем токены в localStorage
			if (response.accessToken && response.refreshToken) {
				// Убираем префикс "Bearer " если он есть
				const accessToken = response.accessToken.replace('Bearer ', '');

				localStorage.setItem('accessToken', accessToken);
				localStorage.setItem('refreshToken', response.refreshToken);
			}

			// Сохраняем информацию о пользователе
			if (response.user) {
				localStorage.setItem('user', JSON.stringify(response.user));
			}

			// Редирект на главную страницу
			navigate('/', { replace: true });
		} catch (err) {
			console.error('Registration error:', err);
			setError(
				err instanceof Error ? err.message : 'Произошла ошибка при регистрации'
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className={styles.wrapper}>
			<form className={styles.form} onSubmit={handleSubmit}>
				<h1 className='text text_type_main-medium mb-6'>Регистрация</h1>
				{error && (
					<div
						className='text text_type_main-default mb-4'
						style={{ color: 'red' }}>
						{error}
					</div>
				)}
				<Input
					type='text'
					placeholder='Имя'
					value={name}
					name='name'
					onChange={(e) => setName(e.target.value)}
					extraClass='mb-6'
					disabled={isLoading}
				/>
				<EmailInput
					value={email}
					name='email'
					onChange={(e) => setEmail(e.target.value)}
					extraClass='mb-6'
					isIcon={false}
				/>
				<PasswordInput
					value={password}
					name='password'
					onChange={(e) => setPassword(e.target.value)}
					extraClass='mb-6'
					icon='ShowIcon'
				/>
				<Button
					htmlType='submit'
					type='primary'
					size='medium'
					extraClass='mb-20'
					disabled={isLoading}>
					{isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
				</Button>
				<div className={styles.footerLinks}>
					<p className='text text_type_main-default text_color_inactive'>
						Уже зарегистрированы?{' '}
						<Link to='/login' className={styles.link}>
							Войти
						</Link>
					</p>
				</div>
			</form>
		</main>
	);
};
