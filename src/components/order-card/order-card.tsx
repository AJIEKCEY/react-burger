import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	CurrencyIcon,
	FormattedDate,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useAppSelector } from '@hooks/redux';
import { selectIngredients } from '@services/selectors';
import { Order } from '@services/slices/feed-slice';
import { TIngredient } from '@/types/types';
import styles from './order-card.module.css';

interface OrderCardProps {
	order: Order;
	onClick?: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const ingredients = useAppSelector(selectIngredients);

	// Получаем ингредиенты заказа и вычисляем общую стоимость
	const orderIngredients = useMemo(() => {
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

	const handleClick = () => {
		// Используем номер заказа в URL, а не ID
		navigate(`/feed/${order.number}`, {
			state: { background: location },
		});
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

	// Показываем только первые 6 ингредиентов, остальные считаем как "еще N"
	const visibleIngredients = orderIngredients.slice(0, 6);
	const hiddenCount = orderIngredients.length - 6;

	return (
		<article className={styles.card} onClick={handleClick}>
			<header className={styles.header}>
				<span className='text text_type_digits-default'>#{order.number}</span>
				<FormattedDate
					date={new Date(order.createdAt)}
					className='text text_type_main-default text_color_inactive'
				/>
			</header>

			<div className={styles.content}>
				<h3 className='text text_type_main-medium mb-2'>
					{order.name || 'Название недоступно'}
				</h3>
				<p
					className={`text text_type_main-default mb-6 ${getStatusClass(order.status)}`}>
					{getStatusText(order.status)}
				</p>

				<div className={styles.footer}>
					<div className={styles.ingredients}>
						{visibleIngredients.map(({ ingredient }, index) => (
							<div
								key={`${ingredient._id}-${index}`}
								className={styles.ingredientImage}
								style={{ zIndex: visibleIngredients.length - index }}>
								<img src={ingredient.image_mobile} alt={ingredient.name} />
								{index === 5 && hiddenCount > 0 && (
									<div className={styles.ingredientCounter}>
										<span className='text text_type_main-default'>
											+{hiddenCount}
										</span>
									</div>
								)}
							</div>
						))}
					</div>

					<div className={styles.price}>
						<span className='text text_type_digits-default mr-2'>
							{totalPrice}
						</span>
						<CurrencyIcon type='primary' />
					</div>
				</div>
			</div>
		</article>
	);
};
