import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
	CurrencyIcon,
	FormattedDate,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './order-card.module.css';
import { Order } from '@/services/slices/feed-slice';
import { RootState } from '@/services/store';
import { TIngredient } from '@/types/types';

interface OrderCardProps {
	order: Order;
	showStatus?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({
	order,
	showStatus = false,
}) => {
	const navigate = useNavigate();
	const location = useLocation();
	const ingredients = useSelector(
		(state: RootState) => state.burgerIngredients?.items || []
	);

	const getOrderIngredients = () => {
		if (!ingredients || !Array.isArray(ingredients) || !order.ingredients) {
			return [];
		}

		return order.ingredients
			.map((id) => ingredients.find((ingredient) => ingredient._id === id))
			.filter(
				(ingredient): ingredient is TIngredient => ingredient !== undefined
			);
	};

	const calculateOrderPrice = () => {
		const orderIngredients = getOrderIngredients();
		return orderIngredients.reduce((total, ingredient) => {
			return total + (ingredient.price || 0);
		}, 0);
	};

	const getStatusText = (status: Order['status']) => {
		switch (status) {
			case 'created':
				return 'Создан';
			case 'pending':
				return 'Готовится';
			case 'done':
				return 'Выполнен';
			default:
				return '';
		}
	};

	const handleCardClick = () => {
		navigate(`/feed/${order._id}`, {
			state: { background: location },
		});
	};

	const orderIngredients = getOrderIngredients();

	// Создаем уникальные ингредиенты для отображения
	const uniqueIngredients = orderIngredients.reduce(
		(acc: TIngredient[], ingredient) => {
			const existing = acc.find((item) => item._id === ingredient._id);
			if (!existing) {
				acc.push(ingredient);
			}
			return acc;
		},
		[]
	);

	const maxVisibleIngredients = 6;
	const visibleIngredients = uniqueIngredients.slice(0, maxVisibleIngredients);
	const hiddenCount = Math.max(
		0,
		uniqueIngredients.length - maxVisibleIngredients
	);

	return (
		<article className={styles.card} onClick={handleCardClick}>
			<div className={styles.header}>
				<span className='text text_type_digits-default'>#{order.number}</span>
				<FormattedDate
					date={new Date(order.createdAt)}
					className='text text_type_main-default text_color_inactive'
				/>
			</div>

			<h3 className={`${styles.name} text text_type_main-medium mt-6`}>
				{order.name || 'Заказ'}
			</h3>

			{showStatus && (
				<p
					className={`${styles.status} text text_type_main-default mt-2 ${
						order.status === 'done' ? styles.statusDone : ''
					}`}>
					{getStatusText(order.status)}
				</p>
			)}

			<div className={`${styles.footer} mt-6`}>
				<div className={styles.ingredients}>
					{visibleIngredients.map((ingredient, index) => {
						const isLast = index === maxVisibleIngredients - 1;
						const showCounter = isLast && hiddenCount > 0;

						return (
							<div
								key={`${ingredient._id}-${index}`}
								className={styles.ingredientWrapper}
								style={{
									zIndex: maxVisibleIngredients - index,
									marginLeft: index > 0 ? '-12px' : '0',
								}}>
								<div className={styles.ingredientImage}>
									<img
										src={ingredient.image_mobile || ingredient.image}
										alt={ingredient.name}
										className={styles.image}
									/>
									{showCounter && (
										<div className={styles.ingredientCounter}>
											<span className='text text_type_main-default'>
												+{hiddenCount}
											</span>
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>

				<div className={styles.price}>
					<span className='text text_type_digits-default mr-2'>
						{calculateOrderPrice()}
					</span>
					<CurrencyIcon type='primary' />
				</div>
			</div>
		</article>
	);
};
