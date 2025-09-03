import React from 'react';
import {
	Routes,
	Route,
	NavLink,
	useLocation,
	useNavigate,
} from 'react-router-dom';
import { useAppDispatch } from '@hooks/redux';
import { logoutUser } from '@services/actions/auth';
import { ProfileForm } from '@components/profile-form/profile-form';
import { ProfileOrders } from '@components/profile-orders/profile-orders';
import styles from './profile.module.css';

export const ProfilePage: React.FC = () => {
	const dispatch = useAppDispatch();
	const location = useLocation();

	const navigate = useNavigate();

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

	const isOrdersPage = location.pathname.includes('/profile/orders');

	return (
		<div className={styles.container}>
			<div className={styles.sidebar}>
				<nav>
					<ul className={styles.menu}>
						<li className={styles.menuItem}>
							<NavLink
								to='/profile'
								end
								className={({ isActive }) =>
									`${styles.menuLink} ${isActive ? styles.active : ''}`
								}>
								<span className='text text_type_main-medium'>Профиль</span>
							</NavLink>
						</li>
						<li className={styles.menuItem}>
							<NavLink
								to='/profile/orders'
								className={({ isActive }) =>
									`${styles.menuLink} ${isActive ? styles.active : ''}`
								}>
								<span className='text text_type_main-medium'>
									История заказов
								</span>
							</NavLink>
						</li>
						<li className={styles.menuItem}>
							<button
								className={`${styles.menuLink} ${styles.logoutButton}`}
								onClick={handleLogout}>
								<span className='text text_type_main-medium text_color_inactive'>
									Выход
								</span>
							</button>
						</li>
					</ul>
				</nav>

				<div className={styles.description}>
					<p className='text text_type_main-default text_color_inactive'>
						{isOrdersPage
							? 'В этом разделе вы можете просмотреть свою историю заказов'
							: 'В этом разделе вы можете изменить свои персональные данные'}
					</p>
				</div>
			</div>

			<div>
				<Routes>
					<Route index element={<ProfileForm />} />
					<Route path='orders' element={<ProfileOrders />} />
					<Route path='orders/:number' element={<ProfileOrders />} />
				</Routes>
			</div>
		</div>
	);
};
