import { initialState } from './initial-state';

import burgerIngredientsSlice from '@services/reducers/burger-ingredients';
import burgerConstructorReducer from '@services/reducers/burger-constructor';
//import { customMiddleware } from "./middleware/custom-middleware"
import { combineSlices, configureStore as createStore } from '@reduxjs/toolkit';
//import { tasksApi } from './tasks/api.js';
import type { Reducer } from '@reduxjs/toolkit';
import type { IInitialState } from '@/types/types';

const rootReducer: Reducer<IInitialState> = combineSlices({
	burgerIngredients: burgerIngredientsSlice,
	burgerConstructor: burgerConstructorReducer,
});

export const configureStore = () => {
	return createStore({
		reducer: rootReducer,
		preloadedState: initialState,
		// middleware: (getDefaultMiddleware) => {
		// 	return getDefaultMiddleware({}).concat(tasksApi.middleware);
		// },
	});
};

// Типы для Redux
export type AppStore = ReturnType<typeof configureStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
