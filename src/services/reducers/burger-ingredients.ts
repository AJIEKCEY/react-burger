import { createSlice } from '@reduxjs/toolkit';
import { fetchIngredients } from '@services/actions/burger-ingredients.ts';
import { initialBurgerIngredientsState } from '@services/initial-state.ts';

// Создаем slice с помощью RTK
const burgerIngredientsSlice = createSlice({
	name: 'burgerIngredients',
	initialState: initialBurgerIngredientsState,
	reducers: {
		// Здесь будут редьюсеры
		setActiveTab: (state, action) => {
			state.activeTab = action.payload;
		},
	},
	extraReducers: (builder) => {
		// Здесь будут обработчики async actions
		builder
			.addCase(fetchIngredients.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchIngredients.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload;
			})
			.addCase(fetchIngredients.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export const { setActiveTab } = burgerIngredientsSlice.actions;
export default burgerIngredientsSlice.reducer;
