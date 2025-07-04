import React from 'react';
import styles from './burger-ingredient.module.css';
import { TIngredient } from '@/types/types';
import { useDrag } from 'react-dnd';
import { DND_TYPES } from '@/constants/dnd';
import {
	Counter,
	CurrencyIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';

type TBurgerIngredientProps = {
	ingredient: TIngredient;
	count?: number;
	onIngredientClick?: (ingredient: TIngredient) => void;
};

export const BurgerIngredient = ({
	onIngredientClick,
	count = 0,
	ingredient,
}: TBurgerIngredientProps): React.JSX.Element => {
	const [{ isDragging }, dragRef] = useDrag({
		type: DND_TYPES.INGREDIENT,
		item: ingredient,
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	return (
		<article
			ref={dragRef}
			className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
			onClick={() => onIngredientClick?.(ingredient)}>
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
