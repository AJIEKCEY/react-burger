import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { OrderInfo } from '@components/order-info/order-info';
import { Loader } from '@components/loader/loader';
import { ErrorMessage } from '@components/error-message/error-message';
import { useOrder } from '@hooks/use-order';
import { AppDispatch, RootState } from '@services/store';
import { fetchIngredients } from '@services/actions/burger-ingredients';
import styles from './order.module.css';

export const OrderPage: React.FC = () => {
	const { number } = useParams<{ number: string }>();
	const dispatch = useDispatch<AppDispatch>();

	const { items: ingredients, loading: ingredientsLoading } = useSelector(
		(state: RootState) => state.burgerIngredients
	);

	const orderNumber = number ? parseInt(number, 10) : undefined;
	const { order, loading: orderLoading, error } = useOrder(orderNumber);

	useEffect(() => {
		// Загружаем ингредиенты, если они еще не загружены
		if (!ingredients || ingredients.length === 0) {
			dispatch(fetchIngredients());
		}
	}, [dispatch, ingredients]);

	const isLoading = orderLoading || ingredientsLoading;

	// Если номер заказа некорректный
	if (!orderNumber || isNaN(orderNumber)) {
		return (
			<div className={styles.container}>
				<div className={styles.notFound}>
					<h1 className='text text_type_main-large mb-8'>
						Некорректный номер заказа
					</h1>
					<p className='text text_type_main-default text_color_inactive'>
						Номер заказа должен быть числом
					</p>
				</div>
			</div>
		);
	}

	// Загрузка
	if (isLoading) {
		return (
			<div className={styles.container}>
				<Loader />
			</div>
		);
	}

	// Ошибка
	if (error && !order) {
		return (
			<div className={styles.container}>
				<ErrorMessage error={error} />
			</div>
		);
	}

	// Заказ не найден
	if (!order) {
		return (
			<div className={styles.container}>
				<div className={styles.notFound}>
					<h1 className='text text_type_main-large mb-8'>Заказ не найден</h1>
					<p className='text text_type_main-default text_color_inactive'>
						Заказ с номером #{orderNumber} не найден
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.orderWrapper}>
				<h1
					className={`text text_type_digits-default mb-10 ${styles.orderNumber}`}>
					#{order.number}
				</h1>
				<OrderInfo order={order} />
			</div>
		</div>
	);
};
