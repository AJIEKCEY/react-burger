import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchIngredients } from '@services/actions/burger-ingredients';
import {
	selectIngredients,
	selectIngredientsLoading,
	selectIngredientsError,
} from '@services/selectors';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { ErrorMessage } from '@components/error-message/error-message';

import styles from './home.module.css';

export const HomePage: React.FC = () => {
	const dispatch = useAppDispatch();
	const ingredients = useAppSelector(selectIngredients);
	const loading = useAppSelector(selectIngredientsLoading);
	const error = useAppSelector(selectIngredientsError);

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

	if (error) {
		return (
			<div className={styles.loaderContainer}>
				<ErrorMessage
					error={`Не удалось загрузить ингредиенты: ${error}`}
					className='mb-4'
				/>
				<button
					className='text text_type_main-default'
					onClick={() => dispatch(fetchIngredients())}
					style={{
						background: 'none',
						border: '1px solid #4C4CFF',
						borderRadius: '4px',
						padding: '8px 16px',
						cursor: 'pointer',
					}}>
					Попробовать снова
				</button>
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
