import reducer, { clearOrder } from '@services/slices/order-slice';
import { createOrder } from '@services/actions/order';
import type { IOrderState } from '@/types/types';

const initialState: IOrderState = {
	orderNumber: null,
	orderName: null,
	loading: false,
	error: null,
};

describe('orderSlice', () => {
	it('возвращает initialState', () => {
		expect(reducer(undefined, { type: '' })).toEqual(initialState);
	});

	it('clearOrder сбрасывает orderNumber, orderName, error', () => {
		const filled = {
			orderNumber: 77,
			orderName: 'MyBurger',
			loading: false,
			error: 'some error',
		};
		const state = reducer(filled, clearOrder());
		expect(state.orderNumber).toBeNull();
		expect(state.orderName).toBeNull();
		expect(state.error).toBeNull();
	});

	it('createOrder.pending выставляет loading=true, error=null', () => {
		const prev = { ...initialState, error: 'fail', loading: false };
		const state = reducer(prev, { type: createOrder.pending.type });
		expect(state.loading).toBe(true);
		expect(state.error).toBeNull();
	});

	it('createOrder.fulfilled сохраняет номер и имя заказа, loading=false, error=null', () => {
		const action = {
			type: createOrder.fulfilled.type,
			payload: {
				success: true,
				name: 'NewOrder',
				order: { number: 123 },
			},
		};
		const prev = { ...initialState, loading: true, error: 'fail' };
		const state = reducer(prev, action);
		expect(state.loading).toBe(false);
		expect(state.orderNumber).toBe(123);
		expect(state.orderName).toBe('NewOrder');
		expect(state.error).toBeNull();
	});

	it('createOrder.rejected сохраняет ошибку из payload', () => {
		const action = {
			type: createOrder.rejected.type,
			payload: 'Ошибка при создании',
		};
		const prev = { ...initialState, loading: true };
		const state = reducer(prev, action);
		expect(state.loading).toBe(false);
		expect(state.error).toBe('Ошибка при создании');
	});

	it('createOrder.rejected с дефолтной ошибкой', () => {
		const action = {
			type: createOrder.rejected.type,
			payload: undefined,
		};
		const prev = { ...initialState, loading: true };
		const state = reducer(prev, action);
		expect(state.loading).toBe(false);
		expect(state.error).toBe('Ошибка создания заказа');
	});
});
