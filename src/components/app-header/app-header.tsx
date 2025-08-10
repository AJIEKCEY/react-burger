import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
	BurgerIcon,
	ListIcon,
	ProfileIcon,
	Logo,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { logoutUser } from '@/services/actions/auth';
import { selectIsAuthenticated, selectUser } from '@services/selectors';

import styles from './app-header.module.css';

export const AppHeader = (): React.JSX.Element => {
	const location = useLocation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const user = useAppSelector(selectUser);

	const isActive = (path: string) => location.pathname === path;

	const handleLogout = async () => {
		try {
			await dispatch(logoutUser()).unwrap();
			navigate('/login');
		} catch (error) {
			// Даже при ошибке пользователь будет разлогинен
			navigate('/login');
		}
	};

	const handleProfileClick = () => {
		if (isAuthenticated) {
			navigate('/profile');
		} else {
			navigate('/login');
		}
	};

	return (
		<header className={styles.header}>
			<nav className={styles.nav}>
				<div className={styles.navGroup}>
					<Link
						to='/'
						className={`${styles.navLink} ${
							isActive('/') ? styles.active : ''
						} pl-5 pr-5 pb-4 pt-4`}>
						<BurgerIcon type={isActive('/') ? 'primary' : 'secondary'} />
						<span className='text text_type_main-default ml-2'>
							Конструктор
						</span>
					</Link>
					<Link
						to='/feed'
						className={`${styles.navLink} ${
							isActive('/feed') ? styles.active : ''
						} pl-5 pr-5 pb-4 pt-4`}>
						<ListIcon type={isActive('/feed') ? 'primary' : 'secondary'} />
						<span className='text text_type_main-default ml-2'>
							Лента заказов
						</span>
					</Link>
				</div>

				<div className={styles.logo}>
					<Link to='/'>
						<Logo />
					</Link>
				</div>

				<div className={styles.navGroup}>
					{isAuthenticated ? (
						<div className={styles.userMenu}>
							<button
								onClick={handleProfileClick}
								className={`${styles.navLink} ${
									isActive('/profile') ? styles.active : ''
								} pl-5 pr-5 pb-4 pt-4`}>
								<ProfileIcon
									type={isActive('/profile') ? 'primary' : 'secondary'}
								/>
								<span className='text text_type_main-default ml-2'>
									{user?.name || 'Личный кабинет'}
								</span>
							</button>
							<button
								onClick={handleLogout}
								className={`${styles.navLink} ${styles.logoutButton} pl-5 pr-5 pb-4 pt-4`}>
								<span className='text text_type_main-default'>Выйти</span>
							</button>
						</div>
					) : (
						<Link
							to='/login'
							className={`${styles.navLink} ${
								isActive('/login') || isActive('/register') ? styles.active : ''
							} pl-5 pr-5 pb-4 pt-4`}>
							<ProfileIcon
								type={
									isActive('/login') || isActive('/register')
										? 'primary'
										: 'secondary'
								}
							/>
							<span className='text text_type_main-default ml-2'>Войти</span>
						</Link>
					)}
				</div>
			</nav>
		</header>
	);
};
