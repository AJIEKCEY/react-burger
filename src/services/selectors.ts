import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/services/store';

// Селекторы для пользователя
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserUpdating = (state: RootState) => state.user.isUpdating;
export const selectUserError = (state: RootState) => state.user.error;

// Селекторы для авторизации
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
	state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthChecked = (state: RootState) =>
	state.auth.isAuthChecked;

// Селекторы для ингредиентов
export const selectIngredients = (state: RootState) =>
	state.burgerIngredients.items;
export const selectIngredientsLoading = (state: RootState) =>
	state.burgerIngredients.loading;
export const selectIngredientsError = (state: RootState) =>
	state.burgerIngredients.error;

// Селекторы для модального окна
export const selectModalState = (state: RootState) => state.modal;
export const selectIngredientModal = (state: RootState) =>
	state.modal.ingredientDetails;
export const selectOrderModal = (state: RootState) => state.modal.orderDetails;

// Селектор для получения количества каждого ингредиента в конструкторе
export const selectIngredientCounts = createSelector(
	[(state: RootState) => state.burgerConstructor],
	(burgerConstructor) => {
		const counts: Record<string, number> = {};

		// Считаем булочку (булочка используется дважды - верх и низ)
		if (burgerConstructor.bun) {
			counts[burgerConstructor.bun._id] = 2;
		}

		// Считаем начинки
		burgerConstructor.fillings.forEach((filling) => {
			counts[filling._id] = (counts[filling._id] || 0) + 1;
		});

		return counts;
	}
);
