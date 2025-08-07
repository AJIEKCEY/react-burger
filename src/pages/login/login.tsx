import React, { useState, useEffect } from 'react';
import {
	EmailInput,
	PasswordInput,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { loginUser } from '@services/actions/auth';
import { clearError } from '@services/slices/auth-slice';
import {
	selectAuthLoading,
	selectAuthError,
	selectIsAuthenticated,
} from '@services/selectors';
import { LocationWithState } from '@/types/types';

import styles from './login.module.css';

export const LoginPage = (): React.JSX.Element => {
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

		if (!email.trim() || !password.trim()) {
			return;
		}

		try {
			await dispatch(loginUser({ email, password })).unwrap();
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
				<h1 className='text text_type_main-medium mb-6'>Вход</h1>
				{error && (
					<div
						className='text text_type_main-default mb-4'
						style={{ color: 'red' }}>
						{error}
					</div>
				)}
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
					disabled={isLoading || !email.trim() || !password.trim()}>
					{isLoading ? 'Вход...' : 'Войти'}
				</Button>
				<div className={styles.footerLinks}>
					<p className='text text_type_main-default text_color_inactive'>
						Вы — новый пользователь?{' '}
						<Link to='/register' className={styles.link}>
							Зарегистрироваться
						</Link>
					</p>
					<p className='text text_type_main-default text_color_inactive'>
						Забыли пароль?{' '}
						<Link to='/forgot-password' className={styles.link}>
							Восстановить пароль
						</Link>
					</p>
				</div>
			</form>
		</main>
	);
};
