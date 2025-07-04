import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { initialBurgerConstructorState } from '@services/initial-state';
import type {
	TIngredient,
	TConstructorIngredient,
	//IBurgerConstructorState,
} from '@/types/types';

const burgerConstructorSlice = createSlice({
	name: 'burgerConstructor',
	initialState: initialBurgerConstructorState,
	reducers: {
		// Добавление булочки
		setBun: (state, action: PayloadAction<TIngredient>) => {
			state.bun = action.payload;
			burgerConstructorSlice.caseReducers.calculateTotalPrice(state);
		},

		// Добавление начинки
		addFilling: (state, action: PayloadAction<TIngredient>) => {
			const newFilling: TConstructorIngredient = {
				...action.payload,
				constructorId: nanoid(),
			};
			state.fillings.push(newFilling);
			burgerConstructorSlice.caseReducers.calculateTotalPrice(state);
		},

		// Удаление начинки по constructorId
		removeFilling: (state, action: PayloadAction<string>) => {
			state.fillings = state.fillings.filter(
				(item) => item.constructorId !== action.payload
			);
			burgerConstructorSlice.caseReducers.calculateTotalPrice(state);
		},

		// Перемещение начинки (для будущего DnD)
		moveFilling: (
			state,
			action: PayloadAction<{ fromIndex: number; toIndex: number }>
		) => {
			const { fromIndex, toIndex } = action.payload;
			const [movedItem] = state.fillings.splice(fromIndex, 1);
			state.fillings.splice(toIndex, 0, movedItem);
		},

		// Очистка конструктора
		clearConstructor: (state) => {
			state.bun = null;
			state.fillings = [];
			state.totalPrice = 0;
		},

		// Установка ингредиентов из массива (для совместимости с текущим API)
		setIngredients: (state, action: PayloadAction<TIngredient[]>) => {
			const ingredients = action.payload;

			// Находим булочку
			const foundBun = ingredients.find((item) => item.type === 'bun');
			state.bun = foundBun || null;

			// Находим начинки и добавляем им constructorId
			state.fillings = ingredients
				.filter((item) => item.type !== 'bun')
				.map((item) => ({
					...item,
					constructorId: nanoid(),
				}));

			burgerConstructorSlice.caseReducers.calculateTotalPrice(state);
		},

		// Внутренний reducer для расчета общей стоимости
		calculateTotalPrice: (state) => {
			const bunPrice = state.bun ? state.bun.price * 2 : 0;
			const fillingsPrice = state.fillings.reduce(
				(sum, item) => sum + item.price,
				0
			);
			state.totalPrice = bunPrice + fillingsPrice;
		},
	},
});

export const {
	setBun,
	addFilling,
	removeFilling,
	moveFilling,
	clearConstructor,
	setIngredients,
	calculateTotalPrice,
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
