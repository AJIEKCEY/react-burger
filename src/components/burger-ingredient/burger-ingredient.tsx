import React from 'react';
import styles from './burger-ingredient.module.css';
import { TIngredient } from '@utils/types.ts';
import {
	Counter,
	CurrencyIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';

type TBurgerIngredientProps = TIngredient & {
	onIngredientClick?: (ingredient: TIngredient) => void;
};

export const BurgerIngredient = ({
	onIngredientClick,
	...ingredient
}: TBurgerIngredientProps): React.JSX.Element => {
	return (
		<article
			className={styles.card}
			onClick={() => onIngredientClick?.(ingredient)}
			role='presentation'>
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
			<Counter count={1} size='default' />
		</article>
	);
};
