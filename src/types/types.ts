export type TIngredientCategory = 'bun' | 'sauce' | 'main';

export type TIngredient = {
	_id: string;
	name: string;
	type: TIngredientCategory;
	proteins: number;
	fat: number;
	carbohydrates: number;
	calories: number;
	price: number;
	image: string;
	image_mobile: string;
	image_large: string;
	__v: number;
};

export interface IBurgerIngredientsState {
	items: TIngredient[];
	loading: boolean;
	error: string | null;
	activeTab: TIngredientCategory;
	// Опционально, если нужно хранить выбранный ингредиент
	selectedIngredient: TIngredient | null;
}

export interface IInitialState {
	burgerIngredients: IBurgerIngredientsState;
	// Здесь можно добавить другие состояния для других слайсов
}
