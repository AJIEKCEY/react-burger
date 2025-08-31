import { configureStore, combineReducers } from '@reduxjs/toolkit';
import burgerIngredientsSlice from './slices/burger-ingredients-slice';
import burgerConstructorSlice from './slices/burger-constructor-slice';
import orderReducer from './slices/order-slice';
import authReducer from './slices/auth-slice';
import userReducer from './slices/user-slice';
import feedReducer from './slices/feed-slice';
import singleOrderReducer from './slices/single-order-slice';

const rootReducer = combineReducers({
	feed: feedReducer,
	burgerIngredients: burgerIngredientsSlice,
	burgerConstructor: burgerConstructorSlice,
	order: orderReducer,
	singleOrder: singleOrderReducer,
	auth: authReducer,
	user: userReducer,
});

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				// Игнорируем проверки сериализуемости для определенных полей
				ignoredPaths: ['feed.connectionError'],
			},
		}),
	devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
