import React from 'react';
import {
	EmailInput,
	PasswordInput,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';
import { loginUser } from '@services/actions/auth';
import { useAuthForm } from '@hooks/use-auth-form';
import { useForm } from '@hooks/use-form';
import { ErrorMessage } from '@components/error-message/error-message';

import styles from './login.module.css';

export const LoginPage = (): React.JSX.Element => {
	const { values, handleChange } = useForm({
		email: '',
		password: '',
	});

	const { isLoading, error, handleAuthSuccess, dispatch } = useAuthForm();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Простая проверка заполненности
		if (!values.email.trim() || !values.password.trim()) {
			return;
		}

		try {
			await dispatch(
				loginUser({
					email: values.email,
					password: values.password,
				})
			).unwrap();
			handleAuthSuccess();
		} catch (err) {
			// Ошибка уже обработана в slice
		}
	};

	// Проверяем, заполнены ли поля
	const isFormFilled = values.email.trim() && values.password.trim();

	return (
		<main className={styles.wrapper}>
			<form className={styles.form} onSubmit={handleSubmit}>
				<h1 className='text text_type_main-medium mb-6'>Вход</h1>
				<ErrorMessage error={error} />

				<EmailInput
					value={values.email}
					name='email'
					onChange={handleChange}
					extraClass='mb-6'
					isIcon={false}
				/>
				<PasswordInput
					value={values.password}
					name='password'
					onChange={handleChange}
					extraClass='mb-6'
					icon='ShowIcon'
				/>
				<Button
					htmlType='submit'
					type='primary'
					size='medium'
					extraClass='mb-20'
					disabled={isLoading || !isFormFilled}>
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
