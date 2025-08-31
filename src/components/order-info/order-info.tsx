import React, { useMemo } from 'react';
import {
	CurrencyIcon,
	FormattedDate,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useAppSelector } from '@hooks/redux';
import { selectIngredients } from '@services/selectors';
import { Order } from '@services/slices/feed-slice';
import { TIngredient } from '@/types/types';
import styles from './order-info.module.css';

interface OrderInfoProps {
	order: Order;
}

interface OrderIngredient {
	ingredient: TIngredient;
	count: number;
}

export const OrderInfo: React.FC<OrderInfoProps> = ({ order }) => {
	const ingredients = useAppSelector(selectIngredients);

	// Получаем ингредиенты заказа с подсчетом количества
	const orderIngredients = useMemo<OrderIngredient[]>(() => {
		const ingredientsMap = new Map<
			string,
			{ ingredient: TIngredient; count: number }
		>();

		order.ingredients.forEach((ingredientId) => {
			const ingredient = ingredients.find((item) => item._id === ingredientId);
			if (ingredient) {
				const existing = ingredientsMap.get(ingredientId);
				if (existing) {
					existing.count += 1;
				} else {
					ingredientsMap.set(ingredientId, { ingredient, count: 1 });
				}
			}
		});

		return Array.from(ingredientsMap.values());
	}, [order.ingredients, ingredients]);

	const totalPrice = useMemo(() => {
		return orderIngredients.reduce((total, { ingredient, count }) => {
			// Булочки считаются дважды (верх + низ)
			const multiplier = ingredient.type === 'bun' ? 2 : 1;
			return total + ingredient.price * count * multiplier;
		}, 0);
	}, [orderIngredients]);

	const getStatusText = (status: Order['status']) => {
		switch (status) {
			case 'created':
				return 'Создан';
			case 'pending':
				return 'Готовится';
			case 'done':
				return 'Выполнен';
			default:
				return 'Неизвестно';
		}
	};

	const getStatusClass = (status: Order['status']) => {
		switch (status) {
			case 'done':
				return styles.statusDone;
			case 'pending':
				return styles.statusPending;
			default:
				return '';
		}
	};

	if (!order) {
		return (
			<div className={styles.container}>
				<p className='text text_type_main-default text_color_inactive'>
					Заказ не найден
				</p>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h2 className='text text_type_main-medium mb-3'>
					{order.name || 'Название недоступно'}
				</h2>
				<p
					className={`text text_type_main-default mb-15 ${getStatusClass(order.status)}`}>
					{getStatusText(order.status)}
				</p>
			</div>

			<div className={styles.composition}>
				<h3 className='text text_type_main-medium mb-6'>Состав:</h3>
				<div className={styles.ingredientsList}>
					{orderIngredients.map(({ ingredient, count }) => (
						<div key={ingredient._id} className={styles.ingredientItem}>
							<div className={styles.ingredientInfo}>
								<div className={styles.ingredientImage}>
									<img src={ingredient.image_mobile} alt={ingredient.name} />
								</div>
								<span className='text text_type_main-default'>
									{ingredient.name}
								</span>
							</div>
							<div className={styles.ingredientPrice}>
								<span className='text text_type_digits-default mr-2'>
									{count} x {ingredient.price}
								</span>
								<CurrencyIcon type='primary' />
							</div>
						</div>
					))}
				</div>
			</div>

			<div className={styles.footer}>
				<FormattedDate
					date={new Date(order.createdAt)}
					className='text text_type_main-default text_color_inactive'
				/>
				<div className={styles.totalPrice}>
					<span className='text text_type_digits-default mr-2'>
						{totalPrice}
					</span>
					<CurrencyIcon type='primary' />
				</div>
			</div>
		</div>
	);
};
