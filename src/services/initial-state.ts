import { IInitialState, IBurgerIngredientsState } from '@/types/types';

// Начальное состояние для конкретного слайса
export const initialBurgerIngredientsState: IBurgerIngredientsState = {
	items: [],
	loading: false,
	error: null,
	activeTab: 'bun',
	selectedIngredient: null,
};

// Общее начальное состояние приложения
export const initialState: IInitialState = {
	burgerIngredients: initialBurgerIngredientsState,
	// Добавьте initialState для других слайсов здесь
};
