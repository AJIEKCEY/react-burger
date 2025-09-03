import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchIngredients } from '@services/actions/burger-ingredients';
import { selectIngredients } from '@services/selectors';
import { useUserOrders } from '@hooks/use-user-orders';
import { OrderCard } from '@components/order-card/order-card';
import { Loader } from '@components/loader/loader';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './profile-orders.module.css';
import { Order } from '@services/slices/feed-slice.ts';

export const ProfileOrders: React.FC = () => {
	const dispatch = useAppDispatch();
	const ingredients = useAppSelector(selectIngredients);
	const { orders, loading, error } = useUserOrders();
	const navigate = useNavigate();
	const location = useLocation();

	// Загружаем ингредиенты при монтировании компонента
	useEffect(() => {
		// Проверяем, загружены ли ингредиенты
		if (ingredients.length === 0) {
			dispatch(fetchIngredients());
		}
	}, [dispatch, ingredients.length]);

	const handleOrderClick = (orderNumber: number) => {
		navigate(`/profile/orders/${orderNumber}`, {
			state: { background: location },
		});
	};

	if (loading && orders.length === 0) {
		return (
			<div className={styles.container}>
				<div className={styles.loader}>
					<Loader />
				</div>
			</div>
		);
	}

	if (error && orders.length === 0) {
		return (
			<div className={styles.container}>
				<div className={styles.error}>
					<p className='text text_type_main-default text_color_inactive'>
						{error}
					</p>
				</div>
			</div>
		);
	}

	if (orders.length === 0) {
		return (
			<div className={styles.container}>
				<div className={styles.empty}>
					<p className='text text_type_main-default text_color_inactive'>
						У вас пока нет заказов
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.ordersList}>
				{orders.map((order: Order) => (
					<OrderCard
						key={order._id}
						order={order}
						onClick={() => handleOrderClick(order.number)}
					/>
				))}
			</div>
		</div>
	);
};
