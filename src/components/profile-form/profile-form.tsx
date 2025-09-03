import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
	Input,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { AppDispatch } from '@services/store';
import { useAppSelector } from '@hooks/redux';
import { updateUserInfo } from '@services/slices/auth-slice';
import styles from './profile-form.module.css';

interface ProfileFormData {
	name: string;
	email: string;
	password: string;
}

export const ProfileForm: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { user, isLoading, error } = useAppSelector((state) => state.auth);

	const [formData, setFormData] = useState<ProfileFormData>({
		name: user?.name || '',
		email: user?.email || '',
		password: '',
	});

	const [isChanged, setIsChanged] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	// Обновляем форму при изменении данных пользователя
	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name,
				email: user.email,
				password: '',
			});
		}
	}, [user]);

	// Проверяем, изменились ли данные
	useEffect(() => {
		if (user) {
			const hasChanges =
				formData.name !== user.name ||
				formData.email !== user.email ||
				formData.password !== '';
			setIsChanged(hasChanges);
		}
	}, [formData, user]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isChanged) return;

		// Подготавливаем данные для отправки
		const updateData: Partial<ProfileFormData> = {};

		if (formData.name !== user?.name) {
			updateData.name = formData.name;
		}

		if (formData.email !== user?.email) {
			updateData.email = formData.email;
		}

		if (formData.password) {
			updateData.password = formData.password;
		}

		try {
			await dispatch(updateUserInfo(updateData)).unwrap();
			// Очищаем пароль после успешного обновления
			setFormData((prev) => ({ ...prev, password: '' }));
		} catch (error) {
			console.error('Ошибка обновления профиля:', error);
		}
	};

	const handleReset = () => {
		if (user) {
			setFormData({
				name: user.name,
				email: user.email,
				password: '',
			});
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className={styles.container}>
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.inputWrapper}>
					<Input
						type='text'
						placeholder='Имя'
						name='name'
						value={formData.name}
						onChange={handleInputChange}
						icon='EditIcon'
						disabled={isLoading}
						error={false}
						errorText=''
						size='default'
					/>
				</div>

				<div className={styles.inputWrapper}>
					<Input
						type='email'
						placeholder='Логин'
						name='email'
						value={formData.email}
						onChange={handleInputChange}
						icon='EditIcon'
						disabled={isLoading}
						error={false}
						errorText=''
						size='default'
					/>
				</div>

				<div className={styles.inputWrapper}>
					<Input
						type={showPassword ? 'text' : 'password'}
						placeholder='Пароль'
						name='password'
						value={formData.password}
						onChange={handleInputChange}
						icon='EditIcon'
						disabled={isLoading}
						error={false}
						errorText=''
						size='default'
						onIconClick={togglePasswordVisibility}
					/>
				</div>

				{error && (
					<div className={styles.error}>
						<p className='text text_type_main-default text_color_inactive'>
							{error}
						</p>
					</div>
				)}

				{isChanged && (
					<div className={styles.actions}>
						<Button
							htmlType='button'
							type='secondary'
							size='medium'
							onClick={handleReset}
							disabled={isLoading}>
							Отмена
						</Button>
						<Button
							htmlType='submit'
							type='primary'
							size='medium'
							disabled={isLoading}>
							{isLoading ? 'Сохранение...' : 'Сохранить'}
						</Button>
					</div>
				)}
			</form>
		</div>
	);
};
