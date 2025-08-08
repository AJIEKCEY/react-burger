import React, { useState, useEffect } from 'react';
import {
	Input,
	EmailInput,
	PasswordInput,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { getUser, updateUser } from '@services/actions/user';
import { logoutUser } from '@services/actions/auth';
import { clearUserError } from '@services/slices/user-slice';
import { ErrorMessage } from '@components/error-message/error-message';
import {
	selectUser,
	selectAuthLoading,
	selectUserLoading,
	selectUserUpdating,
	selectUserError,
} from '@services/selectors';

import { useNavigate } from 'react-router-dom';
import styles from './profile.module.css';

export const ProfilePage: React.FC = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [originalData, setOriginalData] = useState({ name: '', email: '' });
	const [isEditing, setIsEditing] = useState(false);

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const user = useAppSelector(selectUser);
	const authLoading = useAppSelector(selectAuthLoading);
	const userLoading = useAppSelector(selectUserLoading);
	const isUpdating = useAppSelector(selectUserUpdating);
	const error = useAppSelector(selectUserError);

	// Загружаем данные пользователя при монтировании
	useEffect(() => {
		dispatch(getUser());
	}, [dispatch]);

	// Обновляем поля при получении данных пользователя
	useEffect(() => {
		if (user) {
			setName(user.name);
			setEmail(user.email);
			setOriginalData({ name: user.name, email: user.email });
		}
	}, [user]);

	// Очищаем ошибки при размонтировании
	useEffect(() => {
		return () => {
			dispatch(clearUserError());
		};
	}, [dispatch]);

	// Проверяем, есть ли изменения
	const hasChanges =
		name !== originalData.name ||
		email !== originalData.email ||
		password.length > 0;

	// Сохранение изменений
	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!hasChanges) return;

		const updateData: { name?: string; email?: string; password?: string } = {};

		if (name !== originalData.name) {
			updateData.name = name;
		}
		if (email !== originalData.email) {
			updateData.email = email;
		}
		if (password.length > 0) {
			updateData.password = password;
		}

		try {
			await dispatch(updateUser(updateData)).unwrap();
			setPassword('');
			setIsEditing(false);
		} catch (err) {
			// Ошибка уже обработана в slice
		}
	};

	// Отмена изменений
	const handleCancel = () => {
		setName(originalData.name);
		setEmail(originalData.email);
		setPassword('');
		setIsEditing(false);
		dispatch(clearUserError());
	};

	// Выход из системы
	const handleLogout = async () => {
		try {
			await dispatch(logoutUser()).unwrap();
			navigate('/login', { replace: true });
		} catch (err) {
			// В случае ошибки все равно перенаправляем на логин
			navigate('/login', { replace: true });
		}
	};

	// Активация режима редактирования
	const handleEdit = () => {
		setIsEditing(true);
	};

	const isLoading = userLoading || authLoading;

	if (isLoading && !user) {
		return (
			<main className={styles.wrapper}>
				<div className={styles.container}>
					<p className='text text_type_main-medium'>Загрузка...</p>
				</div>
			</main>
		);
	}

	return (
		<main className={styles.wrapper}>
			<div className={styles.container}>
				<div className={styles.sidebar}>
					<nav>
						<button
							className={`${styles.navButton} ${styles.active}`}
							type='button'>
							<span className='text text_type_main-medium'>Профиль</span>
						</button>
						<button className={styles.navButton} type='button'>
							<span className='text text_type_main-medium text_color_inactive'>
								История заказов
							</span>
						</button>
						<button
							className={styles.navButton}
							type='button'
							onClick={handleLogout}
							disabled={isLoading}>
							<span className='text text_type_main-medium text_color_inactive'>
								Выход
							</span>
						</button>
					</nav>
					<p className='text text_type_main-default text_color_inactive mt-20'>
						В этом разделе вы можете изменить свои персональные данные
					</p>
				</div>

				<div className={styles.content}>
					<form className={styles.form} onSubmit={handleSave}>
						<ErrorMessage error={error} />
						<Input
							type='text'
							placeholder='Имя'
							value={name}
							name='name'
							onChange={(e) => {
								setName(e.target.value);
								setIsEditing(true);
							}}
							icon={isEditing ? undefined : 'EditIcon'}
							disabled={isLoading}
							onIconClick={handleEdit}
							extraClass='mb-6'
						/>

						<EmailInput
							value={email}
							name='email'
							onChange={(e) => {
								setEmail(e.target.value);
								setIsEditing(true);
							}}
							isIcon={!isEditing}
							disabled={isLoading}
							extraClass='mb-6'
						/>

						<PasswordInput
							value={password}
							name='password'
							onChange={(e) => {
								setPassword(e.target.value);
								setIsEditing(true);
							}}
							icon={isEditing ? 'ShowIcon' : 'EditIcon'}
							disabled={isLoading}
							placeholder='Пароль'
							extraClass='mb-6'
						/>

						{isEditing && hasChanges && (
							<div className={styles.buttons}>
								<Button
									htmlType='button'
									type='secondary'
									size='medium'
									onClick={handleCancel}
									disabled={isUpdating}>
									Отмена
								</Button>
								<Button
									htmlType='submit'
									type='primary'
									size='medium'
									disabled={isUpdating}>
									{isUpdating ? 'Сохранение...' : 'Сохранить'}
								</Button>
							</div>
						)}
					</form>
				</div>
			</div>
		</main>
	);
};
