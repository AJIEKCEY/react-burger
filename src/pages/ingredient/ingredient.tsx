import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
	selectIngredients,
	selectIngredientsLoading,
} from '@services/selectors';
import { fetchIngredients } from '@services/actions/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { useModal } from '@hooks/use-modal';
import styles from './ingredient.module.css';

export const IngredientPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const ingredients = useAppSelector(selectIngredients);
	const loading = useAppSelector(selectIngredientsLoading);
	const { openIngredientModal, ingredientModal } = useModal();

	useEffect(() => {
		// Если ингредиенты еще не загружены, загружаем их
		if (ingredients.length === 0) {
			dispatch(fetchIngredients());
		}
	}, [dispatch, ingredients.length]);

	useEffect(() => {
		// Когда ингредиенты загружены, находим нужный и устанавливаем в модальное состояние
		if (ingredients.length > 0 && id) {
			const ingredient = ingredients.find((item) => item._id === id);
			if (ingredient) {
				// Только если ингредиент еще не установлен в модальном состоянии
				if (
					!ingredientModal.ingredient ||
					ingredientModal.ingredient._id !== id
				) {
					openIngredientModal(ingredient);
				}
			} else {
				// Ингредиент не найден, перенаправляем на 404
				navigate('*', { replace: true });
			}
		}
	}, [
		ingredients,
		id,
		openIngredientModal,
		navigate,
		ingredientModal.ingredient,
	]);

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
