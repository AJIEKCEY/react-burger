import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Импортируем реальные редьюсеры, чтобы тестовый store соответствовал приложению
import burgerIngredientsReducer from '@/services/slices/burger-ingredients-slice';
import burgerConstructorReducer from '@/services/slices/burger-constructor-slice';
import orderReducer from '@/services/slices/order-slice';
import authReducer from '@/services/slices/auth-slice';
import userReducer from '@/services/slices/user-slice';
import feedReducer from '@/services/slices/feed-slice';
import singleOrderReducer from '@/services/slices/single-order-slice';
import userOrdersReducer from '@/services/slices/user-orders-slice';
import type { RootState as AppRootState } from '@/services/store';

export type RootState = AppRootState;

export const createTestStore = (preloadedState: Partial<RootState> = {}) => {
	const rootReducer = combineReducers({
		feed: feedReducer,
		burgerIngredients: burgerIngredientsReducer,
		burgerConstructor: burgerConstructorReducer,
		order: orderReducer,
		singleOrder: singleOrderReducer,
		auth: authReducer,
		user: userReducer,
		userOrders: userOrdersReducer,
	});

	return configureStore({
		reducer: rootReducer,
		preloadedState: preloadedState as RootState,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: false,
			}),
	});
};

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
	preloadedState?: Partial<RootState>;
	store?: ReturnType<typeof createTestStore>;
}

export const renderWithProviders = (
	ui: ReactElement,
	{
		preloadedState = {},
		store = createTestStore(preloadedState),
		...renderOptions
	}: ExtendedRenderOptions = {}
) => {
	const Wrapper = ({ children }: { children: React.ReactNode }) => {
		return (
			<BrowserRouter>
				<Provider store={store}>
					<DndProvider backend={HTML5Backend}>{children}</DndProvider>
				</Provider>
			</BrowserRouter>
		);
	};

	return {
		store,
		...render(ui, { wrapper: Wrapper, ...renderOptions }),
	};
};
