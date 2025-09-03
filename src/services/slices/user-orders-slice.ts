import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { wsManager, WebSocketMessageData } from '@/services/websocket-manager';
import { tokenService } from '@/services/token-service';

// Используем те же типы что и в feed-slice
export interface Order {
	ingredients: string[];
	_id: string;
	status: 'created' | 'pending' | 'done';
	number: number;
	createdAt: string;
	updatedAt: string;
	name?: string;
}

export interface UserOrdersData {
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

// Колбэки для WebSocket
let userOrdersMessageCallback: ((data: WebSocketMessageData) => void) | null =
	null;
let userOrdersOpenCallback: (() => void) | null = null;
let userOrdersErrorCallback: ((error: WebSocketError) => void) | null = null;

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
		const accessToken = tokenService.getAccessToken();
		if (!accessToken) {
			return rejectWithValue('Отсутствует токен авторизации');
		}

		dispatch(wsConnecting());

		const wsUrl = getUserOrdersWSUrl();

		// Создаем колбэки
		if (!userOrdersMessageCallback) {
			userOrdersMessageCallback = (data: WebSocketMessageData) => {
				// Проверяем, что данные соответствуют UserOrdersData
				if (
					typeof data === 'object' &&
					data !== null &&
					'orders' in data &&
					'total' in data &&
					'totalToday' in data &&
					'success' in data
				) {
					const userOrdersData = data as unknown as UserOrdersData;
					dispatch(wsMessage(userOrdersData));
				} else {
					console.error('Получены некорректные данные от WebSocket:', data);
				}
			};
		}

		if (!userOrdersOpenCallback) {
			userOrdersOpenCallback = () => {
				dispatch(wsConnected());
			};
		}

		if (!userOrdersErrorCallback) {
			userOrdersErrorCallback = (error: WebSocketError) => {
				dispatch(
					wsError(
						`Ошибка подключения к истории заказов: ${error.message || 'Неизвестная ошибка'}`
					)
				);
			};
		}

		wsManager.connect(
			wsUrl,
			userOrdersMessageCallback,
			userOrdersOpenCallback,
			userOrdersErrorCallback
		);
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'Неизвестная ошибка подключения';
		return rejectWithValue(errorMessage);
	}
});

// Thunk для отключения от WebSocket
export const disconnectUserOrders = createAsyncThunk<
	void,
	void,
	{
		state: { userOrders: UserOrdersState };
		rejectValue: string;
	}
>(
	'userOrders/disconnect',
	async (_, { dispatch, getState, rejectWithValue }) => {
		try {
			const state = getState();
			const wsUrl = getUserOrdersWSUrl();

			if (
				!state.userOrders.connected &&
				wsManager.getSubscribersCount(wsUrl) === 0
			) {
				return;
			}

			if (userOrdersMessageCallback) {
				wsManager.disconnect(wsUrl, userOrdersMessageCallback);
			} else {
				wsManager.disconnect(wsUrl);
			}

			dispatch(wsDisconnected());
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Ошибка при отключении';
			return rejectWithValue(errorMessage);
		}
	}
);

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
		forceDisconnect: () => {
			const wsUrl = getUserOrdersWSUrl();
			wsManager.disconnect(wsUrl);
			userOrdersMessageCallback = null;
			userOrdersOpenCallback = null;
			userOrdersErrorCallback = null;
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
			})
			.addCase(disconnectUserOrders.pending, () => {
				// Индикатор процесса отключения
			})
			.addCase(disconnectUserOrders.fulfilled, (state) => {
				state.connected = false;
			})
			.addCase(disconnectUserOrders.rejected, (state, action) => {
				state.connected = false;
				state.error =
					action.payload || action.error.message || 'Ошибка при отключении';
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
	forceDisconnect,
} = userOrdersSlice.actions;

export default userOrdersSlice.reducer;
