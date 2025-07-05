import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/services/store';

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
