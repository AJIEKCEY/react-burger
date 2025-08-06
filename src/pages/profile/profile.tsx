import React, { useState } from 'react';
import {
	Input,
	EmailInput,
	PasswordInput,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './profile.module.css';

export const ProfilePage: React.FC = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isEdited, setIsEdited] = useState(false);
	const navigate = useNavigate();

	// Отслеживаем изменения в полях
	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
		setIsEdited(true);
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
		setIsEdited(true);
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		setIsEdited(true);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Здесь будет логика сохранения данных профиля
		console.log('Saving profile data:', { name, email, password });
		setIsEdited(false);
	};

	const handleCancel = () => {
		// Сброс полей к исходным значениям
		setName('');
		setEmail('');
		setPassword('');
		setIsEdited(false);
	};

	const handleLogout = () => {
		// Здесь будет логика выхода из системы
		console.log('Logging out...');
		navigate('/login');
	};

	return (
		<main className={styles.wrapper}>
			<div className={styles.container}>
				<nav className={styles.sidebar}>
					<ul className={styles.menu}>
						<li className={styles.menuItem}>
							<NavLink
								to='/profile'
								className={({ isActive }) =>
									`${styles.menuLink} text text_type_main-medium ${
										isActive ? styles.active : 'text_color_inactive'
									}`
								}>
								Профиль
							</NavLink>
						</li>
						<li className={styles.menuItem}>
							<NavLink
								to='/profile/orders'
								className={({ isActive }) =>
									`${styles.menuLink} text text_type_main-medium ${
										isActive ? styles.active : 'text_color_inactive'
									}`
								}>
								История заказов
							</NavLink>
						</li>
						<li className={styles.menuItem}>
							<button
								className={`${styles.menuLink} ${styles.logoutButton} text text_type_main-medium text_color_inactive`}
								onClick={handleLogout}>
								Выход
							</button>
						</li>
					</ul>
					<p
						className={`${styles.description} text text_type_main-default text_color_inactive mt-20`}>
						В этом разделе вы можете изменить свои персональные данные
					</p>
				</nav>

				<div className={styles.content}>
					<form className={styles.form} onSubmit={handleSubmit}>
						<Input
							type='text'
							placeholder='Имя'
							value={name}
							name='name'
							onChange={handleNameChange}
							icon='EditIcon'
							extraClass='mb-6'
						/>
						<EmailInput
							value={email}
							name='email'
							placeholder='Логин'
							onChange={handleEmailChange}
							isIcon={true}
							extraClass='mb-6'
						/>
						<PasswordInput
							value={password}
							name='password'
							placeholder='Пароль'
							onChange={handlePasswordChange}
							icon='EditIcon'
							extraClass='mb-6'
						/>
						{isEdited && (
							<div className={styles.buttons}>
								<Button
									htmlType='button'
									type='secondary'
									size='medium'
									onClick={handleCancel}>
									Отмена
								</Button>
								<Button htmlType='submit' type='primary' size='medium'>
									Сохранить
								</Button>
							</div>
						)}
					</form>
				</div>
			</div>
		</main>
	);
};
