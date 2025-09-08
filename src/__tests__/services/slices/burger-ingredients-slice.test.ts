import type { TIngredientCategory } from '@/types/types';
import reducer, {
	setActiveTab,
	setActiveTabFromScroll,
} from '@services/slices/burger-ingredients-slice';
import { fetchIngredients } from '@services/actions/burger-ingredients';

const initialState = {
	items: [],
	loading: false,
	error: null,
	activeTab: 'bun' as TIngredientCategory,
};

const mockItem = {
	_id: 'someid',
	name: 'Тест ингредиент',
	type: 'main',
	proteins: 10,
	fat: 11,
	carbohydrates: 12,
	calories: 13,
	price: 222,
	image: 'img.jpg',
	image_mobile: 'imgm.jpg',
	image_large: 'imgl.jpg',
	__v: 0,
};

describe('burgerIngredientsSlice', () => {
	it('возвращает initialState', () => {
		expect(reducer(undefined, { type: '' })).toEqual(initialState);
	});

	it('setActiveTab изменяет activeTab', () => {
		const state = reducer(initialState, setActiveTab('main'));
		expect(state.activeTab).toBe('main');
	});

	it('setActiveTabFromScroll изменяет activeTab', () => {
		const state = reducer(initialState, setActiveTabFromScroll('sauce'));
		expect(state.activeTab).toBe('sauce');
	});

	describe('fetchIngredients экшены', () => {
		it('pending', () => {
			const state = reducer(
				{ ...initialState, error: 'err!' },
				{ type: fetchIngredients.pending.type }
			);
			expect(state.loading).toBe(true);
			expect(state.error).toBeNull();
		});

		it('fulfilled', () => {
			const data = [mockItem, { ...mockItem, _id: '2', name: 'Второй' }];
			const state = reducer(initialState, {
				type: fetchIngredients.fulfilled.type,
				payload: data,
			});
			expect(state.loading).toBe(false);
			expect(state.error).toBeNull();
			expect(state.items).toEqual(data);
		});

		it('rejected с текстом ошибки', () => {
			const state = reducer(initialState, {
				type: fetchIngredients.rejected.type,
				payload: 'Ошибка загрузки',
			});
			expect(state.loading).toBe(false);
			expect(state.error).toBe('Ошибка загрузки');
		});

		it('rejected без текста ошибки', () => {
			const state = reducer(initialState, {
				type: fetchIngredients.rejected.type,
				payload: undefined,
			});
			expect(state.loading).toBe(false);
			expect(state.error).toBe('Ошибка загрузки ингредиентов');
		});
	});
});
