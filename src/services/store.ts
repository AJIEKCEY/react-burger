import { configureStore } from '@reduxjs/toolkit';
import burgerIngredientsSlice from './slices/burger-ingredients-slice';
import burgerConstructorSlice from './slices/burger-constructor-slice';
import orderReducer from './slices/order-slice';
import authReducer from './slices/auth-slice';
import userReducer from './slices/user-slice';

export const store = configureStore({
	reducer: {
		burgerIngredients: burgerIngredientsSlice,
		burgerConstructor: burgerConstructorSlice,
		order: orderReducer,
		auth: authReducer,
		user: userReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
