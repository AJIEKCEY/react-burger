import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchIngredients } from '@services/actions/burger-ingredients';
import {
	selectIngredients,
	selectIngredientsLoading,
} from '@services/selectors';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import styles from './burger.module.css';

export const BurgerPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const ingredients = useAppSelector(selectIngredients);
	const loading = useAppSelector(selectIngredientsLoading);

	// Загружаем ингредиенты при монтировании
	useEffect(() => {
		if (ingredients.length === 0) {
			dispatch(fetchIngredients());
		}
	}, [dispatch, ingredients.length]);

	if (loading) {
		return (
			<div className={styles.loaderContainer}>
				<p className='text text_type_main-medium'>Загрузка ингредиентов...</p>
			</div>
		);
	}

	return (
		<main className={styles.main}>
			<div className={styles.container}>
				<BurgerIngredients />
				<BurgerConstructor />
			</div>
		</main>
	);
};
