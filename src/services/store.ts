import { configureStore } from '@reduxjs/toolkit';
import burgerIngredientsSlice from './slices/burger-ingredients-slice';
import burgerConstructorSlice from './slices/burger-constructor-slice';
import orderReducer from './slices/order-slice';
import modalReducer from './slices/modal-slice';

export const store = configureStore({
	reducer: {
		burgerIngredients: burgerIngredientsSlice,
		burgerConstructor: burgerConstructorSlice,
		order: orderReducer,
		modal: modalReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
