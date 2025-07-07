import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@utils/api';
import { API_ENDPOINTS } from '@/constants/api.ts';
import { TIngredient } from '@/types/types';

interface IngredientsResponse {
	success: boolean;
	data: TIngredient[];
}

export const fetchIngredients = createAsyncThunk<
	TIngredient[],
	void,
	{ rejectValue: string }
>('burgerIngredients/fetchIngredients', async (_, { rejectWithValue }) => {
	try {
		const response = await api.get<IngredientsResponse>(
			API_ENDPOINTS.INGREDIENTS
		);
		return response.data;
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Неизвестная ошибка';
		return rejectWithValue(message);
	}
});
