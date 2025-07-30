import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@utils/api';
import { API_ENDPOINTS } from '@/constants/api.ts';
import { TOrderRequest, TOrderResponse } from '@/types/types';

export const createOrder = createAsyncThunk<
	TOrderResponse,
	TOrderRequest,
	{ rejectValue: string }
>(
	'order/createOrder',
	async (orderData: TOrderRequest, { rejectWithValue }) => {
		try {
			return await api.post<TOrderResponse>(API_ENDPOINTS.ORDERS, orderData);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Неизвестная ошибка';
			return rejectWithValue(message);
		}
	}
);
