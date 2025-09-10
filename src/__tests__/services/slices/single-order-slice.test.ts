import reducer, {
	clearOrder,
	setOrder,
	fetchOrderByNumber,
} from '@services/slices/single-order-slice';
import type { SingleOrderState } from '@services/slices/single-order-slice';
import type { Order } from '@services/slices/feed-slice';

const exampleOrder: Order = {
	ingredients: ['ingr1', 'ingr2'],
	_id: 'order42',
	status: 'pending',
	number: 42,
	createdAt: '2024-04-30T00:00:00.000Z',
	updatedAt: '2024-04-30T00:11:22.000Z',
	name: 'OrderName',
};

const initialState: SingleOrderState = {
	order: null,
	loading: false,
	error: null,
};

describe('singleOrderSlice', () => {
	it('возвращает initialState', () => {
		expect(reducer(undefined, { type: '' })).toEqual(initialState);
	});

	it('clearOrder очищает order и error', () => {
		const prev = { ...initialState, order: exampleOrder, error: 'fail' };
		const state = reducer(prev, clearOrder());
		expect(state.order).toBeNull();
		expect(state.error).toBeNull();
	});

	it('setOrder устанавливает order и сбрасывает ошибку', () => {
		const prev = { ...initialState, error: 'ошибка' };
		const state = reducer(prev, setOrder(exampleOrder));
		expect(state.order).toEqual(exampleOrder);
		expect(state.error).toBeNull();
	});

	it('fetchOrderByNumber.pending: loading true, error null', () => {
		const prev = { ...initialState, error: 'some', loading: false };
		const state = reducer(prev, { type: fetchOrderByNumber.pending.type });
		expect(state.loading).toBe(true);
		expect(state.error).toBeNull();
	});

	it('fetchOrderByNumber.fulfilled: loading false, возвращает order, error null', () => {
		const prev = { ...initialState, loading: true, order: null, error: 'e' };
		const state = reducer(prev, {
			type: fetchOrderByNumber.fulfilled.type,
			payload: exampleOrder,
		});
		expect(state.loading).toBe(false);
		expect(state.order).toEqual(exampleOrder);
		expect(state.error).toBeNull();
	});

	it('fetchOrderByNumber.rejected: loading false, error из payload', () => {
		const prev = { ...initialState, loading: true, error: null };
		const state = reducer(prev, {
			type: fetchOrderByNumber.rejected.type,
			payload: 'Ошибка поиска',
		});
		expect(state.loading).toBe(false);
		expect(state.error).toBe('Ошибка поиска');
	});

	it('fetchOrderByNumber.rejected: loading false, стандартная ошибка', () => {
		const prev = { ...initialState, loading: true, error: null };
		const state = reducer(prev, {
			type: fetchOrderByNumber.rejected.type,
			payload: undefined,
		});
		expect(state.loading).toBe(false);
		expect(state.error).toBe('Ошибка при загрузке заказа');
	});
});
