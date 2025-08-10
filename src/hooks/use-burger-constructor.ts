import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
	addIngredient,
	removeFilling,
	moveFilling,
	clearConstructor,
	setIngredients,
} from '@services/slices/burger-constructor-slice';
import { createOrder } from '@services/actions/order';
import { clearOrder } from '@services/slices/order-slice';
import { useNavigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated } from '@services/selectors';

import { TIngredient } from '@/types/types';

export const useBurgerConstructor = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const isAuthenticated = useAppSelector(selectIsAuthenticated);

	const { bun, fillings, totalPrice } = useAppSelector(
		(state) => state.burgerConstructor
	);
	const { loading: orderLoading } = useAppSelector((state) => state.order);

	const handleAddIngredient = useCallback(
		(ingredient: TIngredient) => {
			dispatch(addIngredient(ingredient));
		},
		[dispatch]
	);

	const handleRemoveFilling = useCallback(
		(constructorId: string) => {
			dispatch(removeFilling(constructorId));
		},
		[dispatch]
	);

	const handleMoveFilling = useCallback(
		(dragIndex: number, hoverIndex: number) => {
			dispatch(moveFilling({ dragIndex, hoverIndex }));
		},
		[dispatch]
	);

	const handleSetIngredients = useCallback(
		(ingredients: TIngredient[]) => {
			dispatch(setIngredients(ingredients));
		},
		[dispatch]
	);

	const handleClearConstructor = useCallback(() => {
		dispatch(clearConstructor());
	}, [dispatch]);

	const handleOrderClick = useCallback(async () => {
		if (!bun || fillings.length === 0) return;

		// Проверяем авторизацию перед отправкой заказа
		if (!isAuthenticated) {
			// Перенаправляем на страницу логина с сохранением текущего состояния
			navigate('/login', {
				state: {
					from: location,
					// Сохраняем информацию о том, что пользователь хотел сделать заказ
					orderIntent: true,
				},
				replace: false,
			});
			return;
		}

		// Собираем массив ID ингредиентов для заказа
		const ingredientIds = [
			bun._id, // Булка снизу
			...fillings.map((filling) => filling._id), // Начинки
			bun._id, // Булка сверху
		];

		try {
			// Создаем заказ
			const result = await dispatch(
				createOrder({ ingredients: ingredientIds })
			).unwrap();

			// Переходим на URL с модалкой заказа
			navigate(`/orders/${result.order.number}`, {
				state: { background: location },
			});

			handleClearConstructor();
		} catch (error) {
			console.error('Ошибка при создании заказа:', error);
		}
	}, [
		bun,
		fillings,
		isAuthenticated,
		navigate,
		location,
		dispatch,
		handleClearConstructor,
	]);

	const handleClearOrder = useCallback(() => {
		dispatch(clearOrder());
	}, [dispatch]);

	return {
		bun,
		fillings,
		totalPrice,
		orderLoading,
		handleAddIngredient,
		handleRemoveFilling,
		handleMoveFilling,
		handleSetIngredients,
		handleClearConstructor,
		handleOrderClick,
		handleClearOrder,
	};
};
