import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IModalState, TIngredient } from '@/types/types';

const initialState: IModalState = {
	ingredientDetails: {
		isOpen: false,
		ingredient: null,
	},
	orderDetails: {
		isOpen: false,
		orderNumber: null,
		orderName: null,
	},
};

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		openIngredientModal: (state, action: PayloadAction<TIngredient>) => {
			state.ingredientDetails.isOpen = true;
			state.ingredientDetails.ingredient = action.payload;
		},
		closeIngredientModal: (state) => {
			state.ingredientDetails.isOpen = false;
			state.ingredientDetails.ingredient = null;
		},
		openOrderModal: (
			state,
			action: PayloadAction<{ orderNumber: number; orderName: string }>
		) => {
			state.orderDetails.isOpen = true;
			state.orderDetails.orderNumber = action.payload.orderNumber;
			state.orderDetails.orderName = action.payload.orderName;
		},
		closeOrderModal: (state) => {
			state.orderDetails.isOpen = false;
			state.orderDetails.orderNumber = null;
			state.orderDetails.orderName = null;
		},
	},
});

export const {
	openIngredientModal,
	closeIngredientModal,
	openOrderModal,
	closeOrderModal,
} = modalSlice.actions;
export default modalSlice.reducer;
