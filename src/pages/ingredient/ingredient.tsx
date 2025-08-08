import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
	selectIngredients,
	selectIngredientsLoading,
} from '@services/selectors';
import { fetchIngredients } from '@services/actions/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import styles from './ingredient.module.css';

export const IngredientPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const dispatch = useAppDispatch();

	const ingredients = useAppSelector(selectIngredients);
	const loading = useAppSelector(selectIngredientsLoading);

	useEffect(() => {
		// Если ингредиенты еще не загружены, загружаем их
		if (ingredients.length === 0) {
			dispatch(fetchIngredients());
		}
	}, [dispatch, ingredients.length]);

	if (loading) {
		return (
			<div className={styles.container}>
				<p className='text text_type_main-medium'>Загрузка...</p>
			</div>
		);
	}

	if (!id || ingredients.length === 0) {
		return (
			<div className={styles.container}>
				<p className='text text_type_main-medium'>Ингредиент не найден</p>
			</div>
		);
	}

	// Найдем ингредиент по id
	const ingredient = ingredients.find((item) => item._id === id);

	if (!ingredient) {
		return (
			<div className={styles.container}>
				<p className='text text_type_main-medium'>Ингредиент не найден</p>
			</div>
		);
	}

	return (
		<main className={styles.container}>
			<h1 className='text text_type_main-large mb-8'>Детали ингредиента</h1>
			<IngredientDetails ingredient={ingredient} />
		</main>
	);
};
