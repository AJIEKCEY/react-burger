import {
	IInitialState,
	IBurgerIngredientsState,
	IBurgerConstructorState,
} from '@/types/types';

// Начальное состояние для конкретного слайса
export const initialBurgerIngredientsState: IBurgerIngredientsState = {
	items: [],
	loading: false,
	error: null,
	activeTab: 'bun',
};

export const initialBurgerConstructorState: IBurgerConstructorState = {
	bun: null,
	fillings: [],
	totalPrice: 0,
};

// Общее начальное состояние приложения
export const initialState: IInitialState = {
	burgerIngredients: initialBurgerIngredientsState,
	burgerConstructor: initialBurgerConstructorState,
	// Добавьте initialState для других слайсов здесь
};
