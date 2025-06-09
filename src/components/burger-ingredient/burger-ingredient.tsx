import React from 'react';
import styles from './burger-ingredient.module.css';
import { TIngredient } from '@utils/types.ts';
import {
	Counter,
	CurrencyIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';

type TBurgerIngredientProps = TIngredient;

export const BurgerIngredient = (
	props: TBurgerIngredientProps
): React.JSX.Element => {
	return (
		<article className={styles.card}>
			<img src={props.image} alt={props.name} className={styles.image} />
			<div className={styles.price}>
				<span className='text text_type_digits-default mr-2'>
					{props.price}
				</span>
				<CurrencyIcon type='primary' />
			</div>
			<p className={`${styles.name} text text_type_main-default`}>
				{props.name}
			</p>
			<Counter count={1} size='default' />
		</article>
	);
};
