import {
	IInitialState,
	IBurgerIngredientsState,
	IBurgerConstructorState,
	IModalState,
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

export const initialModalState: IModalState = {
	ingredientDetails: {
		isOpen: false,
		ingredient: null,
	},
};

// Общее начальное состояние приложения
export const initialState: IInitialState = {
	burgerIngredients: initialBurgerIngredientsState,
	burgerConstructor: initialBurgerConstructorState,
	modal: initialModalState,
	// Добавьте initialState для других слайсов здесь
};
