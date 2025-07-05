import { createSlice } from '@reduxjs/toolkit';
import { IOrderState } from '@/types/types';
import { createOrder } from '@services/actions/order';

const initialState: IOrderState = {
	orderNumber: null,
	orderName: null,
	loading: false,
	error: null,
};

const orderSlice = createSlice({
	name: 'order',
	initialState,
	reducers: {
		clearOrder: (state) => {
			state.orderNumber = null;
			state.orderName = null;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createOrder.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createOrder.fulfilled, (state, action) => {
				state.loading = false;
				state.orderNumber = action.payload.order.number;
				state.orderName = action.payload.name;
				state.error = null;
			})
			.addCase(createOrder.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Ошибка создания заказа';
			});
	},
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
