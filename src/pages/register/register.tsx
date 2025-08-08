import React, { useState } from 'react';
import {
	Input,
	EmailInput,
	PasswordInput,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';
import { registerUser } from '@services/actions/auth';
import { useAuthForm } from '@hooks/use-auth-form';
import { ErrorMessage } from '@components/error-message/error-message';

import styles from './register.module.css';

export const RegisterPage = (): React.JSX.Element => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { isLoading, error, handleAuthSuccess, dispatch } = useAuthForm();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim() || !email.trim() || !password.trim()) {
			return;
		}

		try {
			await dispatch(registerUser({ email, password, name })).unwrap();
			handleAuthSuccess();
		} catch (err) {
			// Ошибка уже обработана в slice
		}
	};

	const isFormValid = name.trim() && email.trim() && password.trim();

	return (
		<main className={styles.wrapper}>
			<form className={styles.form} onSubmit={handleSubmit}>
				<h1 className='text text_type_main-medium mb-6'>Регистрация</h1>
				<ErrorMessage error={error} />
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
					disabled={isLoading || !isFormValid}>
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
