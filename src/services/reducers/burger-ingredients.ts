import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchIngredients } from '@services/actions/burger-ingredients.ts';
import { initialBurgerIngredientsState } from '@services/initial-state.ts';
import type { TIngredientCategory } from '@/types/types';

// Создаем slice с помощью RTK
const burgerIngredientsSlice = createSlice({
	name: 'burgerIngredients',
	initialState: initialBurgerIngredientsState,
	reducers: {
		// Здесь будут редьюсеры
		setActiveTab: (state, action: PayloadAction<TIngredientCategory>) => {
			state.activeTab = action.payload;
		},
		// Добавляем action для автоматического переключения таба при прокрутке
		setActiveTabFromScroll: (
			state,
			action: PayloadAction<TIngredientCategory>
		) => {
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

export const { setActiveTab, setActiveTabFromScroll } =
	burgerIngredientsSlice.actions;
export default burgerIngredientsSlice.reducer;
