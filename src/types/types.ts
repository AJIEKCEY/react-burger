import { Location } from 'react-router-dom';

// Определяем тип для custom state
export interface CustomLocationState {
	background?: Location;
	from?: Location;
}

// Используем дженерик Location
export type LocationWithState = Location<CustomLocationState>;

export type TIngredientCategory = 'bun' | 'sauce' | 'main';

export type TIngredient = {
	_id: string;
	name: string;
	type: TIngredientCategory;
	proteins: number;
	fat: number;
	carbohydrates: number;
	calories: number;
	price: number;
	image: string;
	image_mobile: string;
	image_large: string;
	__v: number;
};

export interface IBurgerIngredientsState {
	items: TIngredient[];
	loading: boolean;
	error: string | null;
	activeTab: TIngredientCategory;
}

// Интерфейс для элемента в конструкторе (с уникальным ID)
export interface TConstructorIngredient extends TIngredient {
	constructorId: string; // Уникальный ID для элемента в конструкторе
}

// Состояние конструктора бургера
export interface IBurgerConstructorState {
	bun: TIngredient | null;
	fillings: TConstructorIngredient[];
	totalPrice: number;
}

// Типы для заказа
export interface TOrderRequest {
	ingredients: string[];
}

export interface TOrderResponse {
	success: boolean;
	name: string;
	order: {
		number: number;
	};
}

// Состояние заказа
export interface IOrderState {
	orderNumber: number | null;
	orderName: string | null;
	loading: boolean;
	error: string | null;
}

//Состояние модального окна
export interface IModalState {
	ingredientDetails: {
		isOpen: boolean;
		ingredient: TIngredient | null;
	};
	orderDetails: {
		isOpen: boolean;
		orderNumber: number | null;
		orderName: string | null;
	};
}

// RootState теперь импортируется из store.ts
import { RootState } from '@services/store';
export type { RootState };

// Типы для Redux экшенов и тулкита
export type TActionCreator<T> = (payload: T) => { type: string; payload: T };
export type TThunkAction<R = void> = import('@reduxjs/toolkit').ThunkAction<
	Promise<R>,
	RootState,
	unknown,
	import('@reduxjs/toolkit').AnyAction
>;
