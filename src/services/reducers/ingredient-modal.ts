import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@/types/types';
import { initialModalState } from '@services/initial-state';

export const modalSlice = createSlice({
	name: 'modal',
	initialState: initialModalState,
	reducers: {
		openIngredientDetails: (state, action: PayloadAction<TIngredient>) => {
			state.ingredientDetails.isOpen = true;
			state.ingredientDetails.ingredient = action.payload;
		},
		closeIngredientDetails: (state) => {
			state.ingredientDetails.isOpen = false;
			state.ingredientDetails.ingredient = null;
		},
	},
});

export const { openIngredientDetails, closeIngredientDetails } =
	modalSlice.actions;
export default modalSlice.reducer;
