import { createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@/types/types';

const API_URL = 'https://norma.nomoreparties.space/api/ingredients';

export const fetchIngredients = createAsyncThunk<
	TIngredient[],
	void,
	{ rejectValue: string }
>('burgerIngredients/fetchIngredients', async (_, { rejectWithValue }) => {
	try {
		const response = await fetch(API_URL);
		if (!response.ok) {
			throw new Error('Server Error!');
		}
		const data = await response.json();
		return data.data;
	} catch (error) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		return rejectWithValue(error.message);
	}
});
