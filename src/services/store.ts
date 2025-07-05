import { initialState } from './initial-state';

import burgerIngredientsSlice from '@services/reducers/burger-ingredients';
import burgerConstructorReducer from '@services/reducers/burger-constructor';
import { combineSlices, configureStore as createStore } from '@reduxjs/toolkit';
import type { Reducer } from '@reduxjs/toolkit';
import type { IInitialState } from '@/types/types';
import modalReducer from '@services/reducers/ingredient-modal';
import orderReducer from '@services/reducers/order';

const rootReducer: Reducer<IInitialState> = combineSlices({
	burgerIngredients: burgerIngredientsSlice,
	burgerConstructor: burgerConstructorReducer,
	order: orderReducer,
	modal: modalReducer,
});

export const configureStore = () => {
	return createStore({
		reducer: rootReducer,
		preloadedState: initialState,
	});
};

// Типы для Redux
export type AppStore = ReturnType<typeof configureStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
