import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { WebSocketMessageData, wsManager } from '@/services/websocket-manager';

// Типы данных
export interface Order {
	ingredients: string[];
	_id: string;
	status: 'created' | 'pending' | 'done';
	number: number;
	createdAt: string;
	updatedAt: string;
	name?: string;
}

export interface FeedData {
	success: boolean;
	orders: Order[];
	total: number;
	totalToday: number;
}

export interface FeedState {
	orders: Order[];
	total: number;
	totalToday: number;
	loading: boolean;
	error: string | null;
	connected: boolean;
}

// Типы для WebSocket событий
export interface WebSocketError {
	message: string;
	code?: number;
	type?: string;
}

const initialState: FeedState = {
	orders: [],
	total: 0,
	totalToday: 0,
	loading: false,
	error: null,
	connected: false,
};

// URL для ленты заказов
const FEED_WS_URL = 'wss://norma.nomoreparties.space/orders/all';

// Создаем фиксированные колбэки для WebSocket
let feedMessageCallback: ((data: WebSocketMessageData) => void) | null = null;
let feedOpenCallback: (() => void) | null = null;
let feedErrorCallback: ((error: WebSocketError) => void) | null = null;

// Thunk для подключения к WebSocket
export const connectFeed = createAsyncThunk<
	void, // return type
	void, // argument type
	{
		state: { feed: FeedState };
		rejectValue: string;
	}
>('feed/connect', async (_, { dispatch, getState, rejectWithValue }) => {
	try {
		// Проверяем, не подключены ли мы уже
		const state = getState();
		if (state.feed.connected) {
			return;
		}

		dispatch(wsConnecting());

		// Создаем колбэки только один раз
		if (!feedMessageCallback) {
			feedMessageCallback = (data: WebSocketMessageData) => {
				// Type guard для проверки структуры данных
				if (
					typeof data === 'object' &&
					data !== null &&
					'orders' in data &&
					'total' in data &&
					'totalToday' in data &&
					'success' in data
				) {
					const feedData = data as unknown as FeedData;
					dispatch(wsMessage(feedData));
				} else {
					console.error(
						'Получены некорректные данные от Feed WebSocket:',
						data
					);
				}
			};
		}

		if (!feedOpenCallback) {
			feedOpenCallback = () => {
				dispatch(wsConnected());
			};
		}

		if (!feedErrorCallback) {
			feedErrorCallback = (error: WebSocketError) => {
				dispatch(
					wsError(
						`Ошибка подключения к ленте заказов: ${error.message || 'Неизвестная ошибка'}`
					)
				);
			};
		}

		wsManager.connect(
			FEED_WS_URL,
			feedMessageCallback,
			feedOpenCallback,
			feedErrorCallback
		);
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'Неизвестная ошибка подключения';
		return rejectWithValue(errorMessage);
	}
});

// Thunk для отключения от WebSocket
export const disconnectFeed = createAsyncThunk<
	void, // return type
	void, // argument type
	{
		state: { feed: FeedState };
		rejectValue: string;
	}
>('feed/disconnect', async (_, { dispatch, getState, rejectWithValue }) => {
	try {
		// Проверяем, подключены ли мы
		const state = getState();
		if (
			!state.feed.connected &&
			wsManager.getSubscribersCount(FEED_WS_URL) === 0
		) {
			return;
		}

		if (feedMessageCallback) {
			wsManager.disconnect(FEED_WS_URL, feedMessageCallback);
		} else {
			wsManager.disconnect(FEED_WS_URL);
		}

		dispatch(wsDisconnected());
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'Ошибка при отключении';
		return rejectWithValue(errorMessage);
	}
});

export const feedSlice = createSlice({
	name: 'feed',
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
		wsMessage: (state, action: PayloadAction<FeedData>) => {
			if (action.payload.success) {
				const { orders, total, totalToday } = action.payload;
				state.orders = orders;
				state.total = total;
				state.totalToday = totalToday;
				state.loading = false;
			}
		},
		clearFeed: (state) => {
			state.orders = [];
			state.total = 0;
			state.totalToday = 0;
		},
		// Добавим действие для принудительной очистки соединения
		forceDisconnect: () => {
			wsManager.disconnect(FEED_WS_URL);
			feedMessageCallback = null;
			feedOpenCallback = null;
			feedErrorCallback = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(connectFeed.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(connectFeed.fulfilled, () => {
				// состояние уже обновлено через wsConnected
			})
			.addCase(connectFeed.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload || action.error.message || 'Ошибка подключения';
			})
			.addCase(disconnectFeed.pending, () => {
				// Можно добавить индикатор процесса отключения
			})
			.addCase(disconnectFeed.fulfilled, (state) => {
				state.connected = false;
			})
			.addCase(disconnectFeed.rejected, (state, action) => {
				// Даже если отключение с ошибкой, считаем что отключились
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
	clearFeed,
	forceDisconnect,
} = feedSlice.actions;

export default feedSlice.reducer;
