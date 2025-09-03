import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { wsManager, WebSocketMessageData } from '@/services/websocket-manager';
import { tokenService } from '@/services/token-service';

export interface Order {
	ingredients: string[];
	_id: string;
	status: 'created' | 'pending' | 'done';
	number: number;
	createdAt: string;
	updatedAt: string;
	name?: string;
}

export interface UserOrdersData extends WebSocketMessageData {
	success: boolean;
	orders: Order[];
	total: number;
	totalToday: number;
}

export interface UserOrdersState {
	orders: Order[];
	total: number;
	totalToday: number;
	loading: boolean;
	error: string | null;
	connected: boolean;
}

export interface WebSocketError {
	message: string;
	code?: number;
	type?: string;
}

// Типы для WebSocket сообщений об ошибках
interface WebSocketErrorMessage extends WebSocketMessageData {
	success: false;
	message: string;
}

const initialState: UserOrdersState = {
	orders: [],
	total: 0,
	totalToday: 0,
	loading: false,
	error: null,
	connected: false,
};

// URL для персональной ленты заказов
const getUserOrdersWSUrl = () => {
	const accessToken = tokenService.getAccessToken();
	return `wss://norma.nomoreparties.space/orders?token=${accessToken}`;
};

// Thunk для подключения к WebSocket
export const connectUserOrders = createAsyncThunk<
	void,
	void,
	{
		state: { userOrders: UserOrdersState };
		rejectValue: string;
	}
>('userOrders/connect', async (_, { dispatch, getState, rejectWithValue }) => {
	try {
		const state = getState();
		if (state.userOrders.connected) {
			return;
		}

		// Проверяем наличие токена
		const accessToken = await tokenService.ensureValidToken();

		if (!accessToken) {
			return rejectWithValue('Не удалось получить действительный токен');
		}

		dispatch(wsConnecting());

		const wsUrl = getUserOrdersWSUrl();

		// Создаем колбэки
		const messageCallback = (data: WebSocketMessageData) => {
			if (isErrorData(data)) {
				dispatch(wsError(data.message));
				return;
			}

			if (isUserOrdersData(data)) {
				dispatch(wsMessage(data));
			}
		};

		const openCallback = () => dispatch(wsConnected());
		const errorCallback = (error: WebSocketError) =>
			dispatch(
				wsError(`Ошибка подключения: ${error.message || 'Неизвестная ошибка'}`)
			);

		wsManager.connect(wsUrl, messageCallback, openCallback, errorCallback);
	} catch (error) {
		return rejectWithValue(
			error instanceof Error ? error.message : 'Ошибка подключения'
		);
	}
});

// Thunk для отключения от WebSocket
export const disconnectUserOrders = createAsyncThunk<void, void>(
	'userOrders/disconnect',
	async (_, { dispatch }) => {
		const wsUrl = getUserOrdersWSUrl();
		wsManager.disconnect(wsUrl);
		dispatch(wsDisconnected());
	}
);

// Type Guards для проверки типов входящих сообщений
const isErrorData = (
	data: WebSocketMessageData
): data is WebSocketErrorMessage => {
	return (
		typeof data === 'object' &&
		data !== null &&
		'success' in data &&
		data.success === false &&
		'message' in data &&
		(data as WebSocketErrorMessage).message === 'string'
	);
};

const isUserOrdersData = (
	data: WebSocketMessageData
): data is UserOrdersData => {
	if (typeof data !== 'object' || data === null) {
		return false;
	}

	const potentialData = data as Record<string, unknown>;

	return (
		'orders' in potentialData &&
		'total' in potentialData &&
		'totalToday' in potentialData &&
		'success' in potentialData &&
		Array.isArray(potentialData.orders) &&
		typeof potentialData.total === 'number' &&
		typeof potentialData.totalToday === 'number' &&
		potentialData.success === true
	);
};

const isValidOrder = (obj: unknown): obj is Order => {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}

	const order = obj as Record<string, unknown>;

	return (
		typeof order._id === 'string' &&
		typeof order.number === 'number' &&
		typeof order.status === 'string' &&
		['created', 'pending', 'done'].includes(order.status as string) &&
		typeof order.createdAt === 'string' &&
		typeof order.updatedAt === 'string' &&
		Array.isArray(order.ingredients) &&
		order.ingredients.every((ing) => typeof ing === 'string') &&
		(order.name === undefined || typeof order.name === 'string')
	);
};

export const userOrdersSlice = createSlice({
	name: 'userOrders',
	initialState,
	reducers: {
		wsConnecting: (state) => {
			state.loading = true;
			state.error = null;
		},
		wsConnected: (state) => {
			state.connected = true;
			state.loading = false;
			state.error = null;
		},
		wsDisconnected: (state) => {
			state.connected = false;
		},
		wsError: (state, action: PayloadAction<string>) => {
			state.error = action.payload;
			state.connected = false;
			state.loading = false;
		},
		wsMessage: (state, action: PayloadAction<UserOrdersData>) => {
			if (action.payload.success) {
				const { orders, total, totalToday } = action.payload;
				// Дополнительная валидация заказов
				const validOrders = orders.filter(isValidOrder);

				if (validOrders.length !== orders.length) {
					console.warn(
						`Получено ${orders.length} заказов, валидных: ${validOrders.length}`
					);
				}

				state.orders = orders;
				state.total = total;
				state.totalToday = totalToday;
				state.loading = false;
			}
		},
		clearUserOrders: (state) => {
			state.orders = [];
			state.total = 0;
			state.totalToday = 0;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(connectUserOrders.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(connectUserOrders.fulfilled, () => {
				// состояние уже обновлено через wsConnected
			})
			.addCase(connectUserOrders.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload || action.error.message || 'Ошибка подключения';
			});
	},
});

export const {
	wsConnecting,
	wsConnected,
	wsDisconnected,
	wsError,
	wsMessage,
	clearUserOrders,
} = userOrdersSlice.actions;

export default userOrdersSlice.reducer;
