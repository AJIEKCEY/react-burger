import React, { useState, useEffect } from 'react';
import {
	Input,
	EmailInput,
	PasswordInput,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { registerUser } from '@services/actions/auth';
import { clearError } from '@services/slices/auth-slice';
import {
	selectAuthLoading,
	selectAuthError,
	selectIsAuthenticated,
} from '@services/selectors';
import { LocationWithState } from '@/types/types';

import styles from './register.module.css';

export const RegisterPage = (): React.JSX.Element => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation() as LocationWithState;

	const isLoading = useAppSelector(selectAuthLoading);
	const error = useAppSelector(selectAuthError);
	const isAuthenticated = useAppSelector(selectIsAuthenticated);

	// Редирект если пользователь уже авторизован
	useEffect(() => {
		if (isAuthenticated) {
			navigate('/', { replace: true });
		}
	}, [isAuthenticated, navigate]);

	// Очищаем ошибку при размонтировании компонента
	useEffect(() => {
		return () => {
			if (error) {
				dispatch(clearError());
			}
		};
	}, [dispatch, error]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim() || !email.trim() || !password.trim()) {
			return;
		}

		try {
			await dispatch(registerUser({ email, password, name })).unwrap();
			// Перенаправляем на страницу, с которой пришел пользователь, или на главную
			const redirectTo = location.state?.from?.pathname || '/';
			navigate(redirectTo, { replace: true });
		} catch (err) {
			// Ошибка уже обработана в slice
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
					disabled={
						isLoading || !name.trim() || !email.trim() || !password.trim()
					}>
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
