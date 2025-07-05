import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOrderRequest, TOrderResponse } from '@/types/types';

const API_BASE_URL = 'https://norma.nomoreparties.space/api';

export const createOrder = createAsyncThunk<
	TOrderResponse,
	TOrderRequest,
	{ rejectValue: string }
>(
	'order/createOrder',
	async (orderData: TOrderRequest, { rejectWithValue }) => {
		try {
			const response = await fetch(`${API_BASE_URL}/orders`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(orderData),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: TOrderResponse = await response.json();

			if (!data.success) {
				throw new Error('Ошибка создания заказа');
			}

			return data;
		} catch (error) {
			return rejectWithValue(
				error instanceof Error ? error.message : 'Неизвестная ошибка'
			);
		}
	}
);
