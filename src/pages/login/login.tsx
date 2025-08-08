import React, { useState } from 'react';
import {
	EmailInput,
	PasswordInput,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';
import { loginUser } from '@services/actions/auth';
import { useAuthForm } from '@hooks/use-auth-form';
import { ErrorMessage } from '@components/error-message/error-message';

import styles from './login.module.css';

export const LoginPage = (): React.JSX.Element => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { isLoading, error, handleAuthSuccess, dispatch } = useAuthForm();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim() || !password.trim()) {
			return;
		}

		try {
			await dispatch(loginUser({ email, password })).unwrap();
			handleAuthSuccess();
		} catch (err) {
			// Ошибка уже обработана в slice
		}
	};

	return (
		<main className={styles.wrapper}>
			<form className={styles.form} onSubmit={handleSubmit}>
				<h1 className='text text_type_main-medium mb-6'>Вход</h1>
				<ErrorMessage error={error} />
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
