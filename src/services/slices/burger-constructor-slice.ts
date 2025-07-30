import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import type {
	TIngredient,
	TConstructorIngredient,
	IBurgerConstructorState,
} from '@/types/types';

const initialState: IBurgerConstructorState = {
	bun: null,
	fillings: [],
	totalPrice: 0,
};

const calculateTotalPrice = (state: IBurgerConstructorState) => {
	const bunPrice = state.bun ? state.bun.price * 2 : 0;
	const fillingsPrice = state.fillings.reduce(
		(sum, item) => sum + item.price,
		0
	);
	state.totalPrice = bunPrice + fillingsPrice;
};

const burgerConstructorSlice = createSlice({
	name: 'burgerConstructor',
	initialState,
	reducers: {
		// Добавление ингредиента (универсальное действие для DnD)
		addIngredient: {
			reducer: (
				state,
				action: PayloadAction<TIngredient | TConstructorIngredient>
			) => {
				const ingredient = action.payload;

				if (ingredient.type === 'bun') {
					// Заменяем булочку
					state.bun = ingredient as TIngredient;
				} else {
					// Добавляем начинку
					state.fillings.push(ingredient as TConstructorIngredient);
				}

				calculateTotalPrice(state);
			},
			prepare: (ingredient: TIngredient) => {
				// Генерируем constructorId для начинки в prepare
				if (ingredient.type !== 'bun') {
					return {
						payload: {
							...ingredient,
							constructorId: nanoid(),
						} as TConstructorIngredient,
					};
				}
				return { payload: ingredient };
			},
		},

		// Удаление начинки по constructorId
		removeFilling: (state, action: PayloadAction<string>) => {
			state.fillings = state.fillings.filter(
				(item) => item.constructorId !== action.payload
			);
			calculateTotalPrice(state);
		},

		// Перемещение начинки (для сортировки)
		moveFilling: (
			state,
			action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
		) => {
			const { dragIndex, hoverIndex } = action.payload;

			// Проверяем валидность индексов
			if (
				dragIndex < 0 ||
				dragIndex >= state.fillings.length ||
				hoverIndex < 0 ||
				hoverIndex >= state.fillings.length ||
				dragIndex === hoverIndex
			) {
				return;
			}

			// Создаем новый массив для избежания мутаций
			const newFillings = [...state.fillings];

			// Получаем перетаскиваемый элемент
			const draggedItem = newFillings[dragIndex];

			// Удаляем элемент из старой позиции
			newFillings.splice(dragIndex, 1);

			// Вставляем элемент в новую позицию
			newFillings.splice(hoverIndex, 0, draggedItem);

			// Обновляем состояние
			state.fillings = newFillings;
		},

		// Очистка конструктора
		clearConstructor: (state) => {
			state.bun = null;
			state.fillings = [];
			state.totalPrice = 0;
		},

		// Установка ингредиентов из массива (для совместимости с текущим API)
		setIngredients: {
			reducer: (
				state,
				action: PayloadAction<(TIngredient | TConstructorIngredient)[]>
			) => {
				const ingredients = action.payload;

				// Находим булочку
				const foundBun = ingredients.find((item) => item.type === 'bun');
				state.bun = foundBun ? (foundBun as TIngredient) : null;

				// Находим начинки
				state.fillings = ingredients.filter(
					(item) => item.type !== 'bun'
				) as TConstructorIngredient[];

				calculateTotalPrice(state);
			},
			prepare: (ingredients: TIngredient[]) => {
				// Генерируем constructorId для начинок в prepare
				const preparedIngredients = ingredients.map((item) =>
					item.type === 'bun'
						? item
						: ({ ...item, constructorId: nanoid() } as TConstructorIngredient)
				);
				return { payload: preparedIngredients };
			},
		},
	},
});

export const {
	addIngredient,
	removeFilling,
	moveFilling,
	clearConstructor,
	setIngredients,
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
