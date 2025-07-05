import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchIngredients } from '../actions/burger-ingredients';
import {
	IBurgerIngredientsState,
	TIngredient,
	TIngredientCategory,
} from '@/types/types';

const initialState: IBurgerIngredientsState = {
	items: [],
	loading: false,
	error: null,
	activeTab: 'bun',
};

const burgerIngredientsSlice = createSlice({
	name: 'burgerIngredients',
	initialState,
	reducers: {
		setActiveTab: (state, action: PayloadAction<TIngredientCategory>) => {
			state.activeTab = action.payload;
		},
		setActiveTabFromScroll: (
			state,
			action: PayloadAction<TIngredientCategory>
		) => {
			state.activeTab = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchIngredients.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchIngredients.fulfilled,
				(state, action: PayloadAction<TIngredient[]>) => {
					state.loading = false;
					state.items = action.payload;
					state.error = null;
				}
			)
			.addCase(fetchIngredients.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Ошибка загрузки ингредиентов';
			});
	},
});

export const { setActiveTab, setActiveTabFromScroll } =
	burgerIngredientsSlice.actions;
export default burgerIngredientsSlice.reducer;
