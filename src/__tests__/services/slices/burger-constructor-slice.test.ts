import reducer, {
	addIngredient,
	removeFilling,
	moveFilling,
	clearConstructor,
	setIngredients,
} from '@services/slices/burger-constructor-slice';

/**
 * Мокированные данные ингредиента для тестов
 */
export const mockIngredient = {
	_id: 'test-ingredient-id',
	name: 'Test Ingredient',
	type: 'main' as const,
	proteins: 100,
	fat: 50,
	carbohydrates: 30,
	calories: 200,
	price: 500,
	image: 'https://test.com/image.png',
	image_mobile: 'https://test.com/image-mobile.png',
	image_large: 'https://test.com/image-large.png',
	__v: 0,
};

// Генерируем тестовые данные
const bun = {
	_id: '1',
	name: 'Булка',
	type: 'bun',
	price: 100,
} as unknown as typeof mockIngredient;
const fillingA = {
	_id: '2',
	name: 'Котлета',
	type: 'main',
	price: 300,
} as unknown as typeof mockIngredient;
const fillingB = {
	_id: '3',
	name: 'Сыр',
	type: 'main',
	price: 200,
} as unknown as typeof mockIngredient;

describe('burgerConstructorSlice', () => {
	const initialState = {
		bun: null,
		fillings: [],
		totalPrice: 0,
	};

	it('возвращает initial state', () => {
		expect(reducer(undefined, { type: '' })).toEqual(initialState);
	});

	it('addIngredient добавляет булку', () => {
		const state = reducer(initialState, addIngredient(bun));
		expect(state.bun).toEqual(bun);
		expect(state.totalPrice).toBe(200); // булка учитывается дважды
	});

	it('addIngredient добавляет начинку с constructorId', () => {
		const state = reducer(initialState, addIngredient(fillingA));
		expect(state.bun).toBeNull();
		expect(state.fillings.length).toBe(1);
		expect(state.fillings[0]._id).toBe(fillingA._id);
		expect(state.fillings[0]).toHaveProperty('constructorId');
		expect(typeof state.fillings[0].constructorId).toBe('string');
		expect(state.totalPrice).toBe(fillingA.price);
	});

	it('addIngredient добавляет несколько начинок', () => {
		let state = reducer(initialState, addIngredient(fillingA));
		state = reducer(state, addIngredient(fillingB));
		expect(state.fillings.length).toBe(2);
		expect(state.totalPrice).toBe(fillingA.price + fillingB.price);
	});

	it('addIngredient заменяет булку, пересчитывая цену', () => {
		let state = reducer(initialState, addIngredient(bun));
		const bun2 = {
			_id: '11',
			name: 'Булка2',
			type: 'bun',
			price: 150,
		} as unknown as typeof mockIngredient;
		state = reducer(state, addIngredient(bun2));
		expect(state.bun).toEqual(bun2);
		expect(state.totalPrice).toBe(300);
	});

	it('removeFilling удаляет начинку по constructorId', () => {
		let state = reducer(initialState, addIngredient(fillingA));
		state = reducer(state, addIngredient(fillingB));
		const idToRemove = state.fillings[0].constructorId;
		state = reducer(state, removeFilling(idToRemove));
		expect(state.fillings.length).toBe(1);
		expect(state.fillings[0]._id).toBe(fillingB._id);
		expect(state.totalPrice).toBe(fillingB.price);
	});

	it('moveFilling меняет порядок начинок', () => {
		let state = reducer(initialState, addIngredient(fillingA));
		state = reducer(state, addIngredient(fillingB));
		const fillingsBefore = [...state.fillings];
		state = reducer(state, moveFilling({ dragIndex: 0, hoverIndex: 1 }));
		expect(state.fillings[0]._id).toBe(fillingsBefore[1]._id);
		expect(state.fillings[1]._id).toBe(fillingsBefore[0]._id);
	});

	it('moveFilling не меняет если индексы невалидны', () => {
		let state = reducer(initialState, addIngredient(fillingA));
		state = reducer(state, addIngredient(fillingB));
		const fillingsBefore = [...state.fillings];
		const unchanged = reducer(
			state,
			moveFilling({ dragIndex: 3, hoverIndex: 0 })
		);
		expect(unchanged.fillings).toEqual(fillingsBefore);
	});

	it('clearConstructor очищает конструктор', () => {
		let state = reducer(initialState, addIngredient(bun));
		state = reducer(state, addIngredient(fillingA));
		state = reducer(state, clearConstructor());
		expect(state).toEqual(initialState);
	});

	it('setIngredients инициализирует bun и fillings с constructorId', () => {
		const ingrs = [bun, fillingA, fillingB];
		const state = reducer(initialState, setIngredients(ingrs));
		expect(state.bun).toEqual(bun);
		expect(state.fillings.length).toBe(2);
		expect(state.fillings[0]).toHaveProperty('constructorId');
		expect(state.totalPrice).toBe(
			fillingA.price + fillingB.price + bun.price * 2
		);
	});

	it('setIngredients работает и без булки', () => {
		const ingrs = [fillingA, fillingB];
		const state = reducer(initialState, setIngredients(ingrs));
		expect(state.bun).toBeNull();
		expect(state.fillings.length).toBe(2);
		expect(state.totalPrice).toBe(fillingA.price + fillingB.price);
	});

	it('setIngredients с пустым массивом - стейт пустой', () => {
		const state = reducer(initialState, setIngredients([]));
		expect(state.bun).toBeNull();
		expect(state.fillings).toEqual([]);
		expect(state.totalPrice).toBe(0);
	});
});
