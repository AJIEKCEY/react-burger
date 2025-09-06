import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/utils/api';
import { Order } from './feed-slice';

// Состояние для индивидуального заказа
export interface SingleOrderState {
	order: Order | null;
	loading: boolean;
	error: string | null;
}

const initialState: SingleOrderState = {
	order: null,
	loading: false,
	error: null,
};

// Типы для API ответа
interface OrderResponse {
	success: boolean;
	orders: Order[];
}

// Thunk для получения заказа по номеру
export const fetchOrderByNumber = createAsyncThunk<
	Order, // return type
	number, // argument type
	{
		rejectValue: string;
	}
>(
	'singleOrder/fetchByNumber',
	async (orderNumber: number, { rejectWithValue }) => {
		try {
			const response = await api.get<OrderResponse>(`/orders/${orderNumber}`);

			if (response.success && response.orders.length > 0) {
				return response.orders[0];
			} else {
				return rejectWithValue(`Заказ №${orderNumber} не найден`);
			}
		} catch (error) {
			console.error('Error fetching order:', error);

			if (error instanceof Error) {
				return rejectWithValue(error.message);
			}

			return rejectWithValue(`Ошибка при загрузке заказа №${orderNumber}`);
		}
	}
);

export const singleOrderSlice = createSlice({
	name: 'singleOrder',
	initialState,
	reducers: {
		clearOrder: (state) => {
			state.order = null;
			state.error = null;
		},
		setOrder: (state, action: PayloadAction<Order>) => {
			state.order = action.payload;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchOrderByNumber.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchOrderByNumber.fulfilled, (state, action) => {
				state.loading = false;
				state.order = action.payload;
				state.error = null;
			})
			.addCase(fetchOrderByNumber.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Ошибка при загрузке заказа';
			});
	},
});

export const { clearOrder, setOrder } = singleOrderSlice.actions;

export default singleOrderSlice.reducer;
