import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './burger-ingredient.module.css';
import { TIngredient } from '@/types/types';
import { useDrag } from 'react-dnd';
import { DND_TYPES } from '@/constants/dnd';
import { useIngredientCount } from '@hooks/use-ingredient-count';
import {
	Counter,
	CurrencyIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';

type TBurgerIngredientProps = {
	ingredient: TIngredient;
};

export const BurgerIngredient = ({
	ingredient,
}: TBurgerIngredientProps): React.JSX.Element => {
	const location = useLocation();
	const navigate = useNavigate();
	const count = useIngredientCount(ingredient._id);

	const [{ isDragging }, dragRef] = useDrag({
		type: DND_TYPES.INGREDIENT,
		item: ingredient,
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	const handleClick = () => {
		if (!isDragging) {
			// Открываем модальное окно и устанавливаем маршрут
			navigate(`/ingredients/${ingredient._id}`, {
				state: { background: location },
			});
		}
	};

	return (
		<article
			ref={dragRef}
			className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
			onClick={handleClick}>
			<img
				src={ingredient.image}
				alt={ingredient.name}
				className={styles.image}
			/>
			<div className={styles.price}>
				<span className='text text_type_digits-default mr-2'>
					{ingredient.price}
				</span>
				<CurrencyIcon type='primary' />
			</div>
			<p className={`${styles.name} text text_type_main-default`}>
				{ingredient.name}
			</p>
			{count > 0 && <Counter count={count} size='default' />}
		</article>
	);
};
