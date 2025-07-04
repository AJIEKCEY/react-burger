import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import {
	setBun,
	addFilling,
	removeFilling,
	moveFilling,
	clearConstructor,
	setIngredients,
} from '@/services/reducers/burger-constructor';
import { IInitialState, TIngredient } from '@/types/types';

export const useBurgerConstructor = () => {
	const dispatch = useAppDispatch();
	const { bun, fillings, totalPrice } = useAppSelector(
		(state: IInitialState) => state.burgerConstructor
	);

	// Добавление булочки
	const handleSetBun = useCallback(
		(ingredient: TIngredient) => {
			dispatch(setBun(ingredient));
		},
		[dispatch]
	);

	// Добавление начинки
	const handleAddFilling = useCallback(
		(ingredient: TIngredient) => {
			dispatch(addFilling(ingredient));
		},
		[dispatch]
	);

	// Удаление начинки
	const handleRemoveFilling = useCallback(
		(constructorId: string) => {
			dispatch(removeFilling(constructorId));
		},
		[dispatch]
	);

	// Перемещение начинки
	const handleMoveFilling = useCallback(
		(fromIndex: number, toIndex: number) => {
			dispatch(moveFilling({ fromIndex, toIndex }));
		},
		[dispatch]
	);

	// Очистка конструктора
	const handleClearConstructor = useCallback(() => {
		dispatch(clearConstructor());
	}, [dispatch]);

	// Установка ингредиентов (для совместимости)
	const handleSetIngredients = useCallback(
		(ingredients: TIngredient[]) => {
			dispatch(setIngredients(ingredients));
		},
		[dispatch]
	);

	// Обработчик оформления заказа
	const handleOrderClick = useCallback(() => {
		if (!bun) {
			alert('Пожалуйста, выберите булочку для бургера');
			return;
		}

		if (fillings.length === 0) {
			alert('Пожалуйста, добавьте начинку для бургера');
			return;
		}

		// Здесь будет логика создания заказа
		console.log('Создание заказа:', {
			bun,
			fillings,
			totalPrice,
		});
	}, [bun, fillings, totalPrice]);

	return {
		// Состояние
		bun,
		fillings,
		totalPrice,

		// Действия
		handleSetBun,
		handleAddFilling,
		handleRemoveFilling,
		handleMoveFilling,
		handleClearConstructor,
		handleSetIngredients,
		handleOrderClick,
	};
};
