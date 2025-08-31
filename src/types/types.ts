import { Location } from 'react-router-dom';

// Определяем тип для custom state
export interface CustomLocationState {
	background?: Location;
	from?: Location;
	orderIntent?: boolean;
	autoSubmitOrder?: boolean;
	canResetPassword?: boolean;
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

// Типы для WebSocket
export interface WebSocketMessage<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
}

export interface WebSocketConnectionConfig {
	url: string;
	protocols?: string | string[];
	options?: {
		reconnect?: boolean;
		reconnectInterval?: number;
		maxReconnectAttempts?: number;
	};
}

// Типы для ошибок
export interface ApiError {
	success: boolean;
	message: string;
	statusCode?: number;
}

export interface ValidationError {
	field: string;
	message: string;
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

// Утилитарные типы
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Nullable<T> = T | null;
export type NonNullable<T> = T extends null | undefined ? never : T;

// Типы для форм
export type FormErrors<T> = Partial<Record<keyof T, string>>;
export type FormTouched<T> = Partial<Record<keyof T, boolean>>;

export interface FormState<T> {
	values: T;
	errors: FormErrors<T>;
	touched: FormTouched<T>;
	isSubmitting: boolean;
	isValid: boolean;
}
