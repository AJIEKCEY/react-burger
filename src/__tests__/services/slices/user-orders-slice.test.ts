import reducer, {
	wsConnecting,
	wsConnected,
	wsDisconnected,
	wsError,
	wsMessage,
	clearUserOrders,
	connectUserOrders,
} from '@services/slices/user-orders-slice';

const exampleOrder = {
	ingredients: ['a', 'b'],
	_id: 'idX',
	status: 'done' as const,
	number: 88,
	createdAt: '2024-04-30T14:20:00.000Z',
	updatedAt: '2024-04-30T16:20:00.000Z',
	name: 'User test order',
};

const validData = {
	success: true,
	orders: [exampleOrder],
	total: 100,
	totalToday: 7,
};

const initialState = {
	orders: [],
	total: 0,
	totalToday: 0,
	loading: false,
	error: null,
	connected: false,
};

describe('userOrdersSlice', () => {
	it('возвращает initialState', () => {
		expect(reducer(undefined, { type: '' })).toEqual(initialState);
	});

	it('wsConnecting: loading=true, error=null', () => {
		const state = reducer({ ...initialState, error: 'err' }, wsConnecting());
		expect(state.loading).toBe(true);
		expect(state.error).toBeNull();
	});

	it('wsConnected: connected=true, loading=false, error=null', () => {
		const prev = { ...initialState, loading: true, error: 'err' };
		const state = reducer(prev, wsConnected());
		expect(state.connected).toBe(true);
		expect(state.loading).toBe(false);
		expect(state.error).toBeNull();
	});

	it('wsDisconnected: connected=false', () => {
		const state = reducer(
			{ ...initialState, connected: true },
			wsDisconnected()
		);
		expect(state.connected).toBe(false);
	});

	it('wsError: error обновляется, connected и loading сбрасываются', () => {
		const state = reducer(
			{ ...initialState, connected: true, loading: true },
			wsError('fail')
		);
		expect(state.error).toBe('fail');
		expect(state.connected).toBe(false);
		expect(state.loading).toBe(false);
	});

	it('wsMessage: success данные обновляются, loading=false', () => {
		const prev = {
			...initialState,
			loading: true,
			orders: [],
			total: 0,
			totalToday: 0,
		};
		const state = reducer(prev, wsMessage(validData));
		expect(state.orders).toEqual(validData.orders);
		expect(state.total).toBe(validData.total);
		expect(state.totalToday).toBe(validData.totalToday);
		expect(state.loading).toBe(false);
	});

	it('clearUserOrders: очищает все', () => {
		const s = {
			...initialState,
			orders: [exampleOrder],
			total: 33,
			totalToday: 5,
		};
		const state = reducer(s, clearUserOrders());
		expect(state.orders).toEqual([]);
		expect(state.total).toBe(0);
		expect(state.totalToday).toBe(0);
	});

	it('connectUserOrders.pending: loading=true, error=null', () => {
		const state = reducer(
			{ ...initialState, error: 'e' },
			{ type: connectUserOrders.pending.type }
		);
		expect(state.loading).toBe(true);
		expect(state.error).toBeNull();
	});

	it('connectUserOrders.rejected: loading=false, error из payload', () => {
		const state = reducer(initialState, {
			type: connectUserOrders.rejected.type,
			payload: 'TOKEN_ERROR',
			error: { message: undefined },
		});
		expect(state.loading).toBe(false);
		expect(state.error).toBe('TOKEN_ERROR');
	});

	it('connectUserOrders.rejected: loading=false, error из error.message', () => {
		const state = reducer(initialState, {
			type: connectUserOrders.rejected.type,
			payload: undefined,
			error: { message: 'Connection failed' },
		});
		expect(state.loading).toBe(false);
		expect(state.error).toBe('Connection failed');
	});

	it('connectUserOrders.rejected: loading=false, стандартная ошибка', () => {
		const state = reducer(initialState, {
			type: connectUserOrders.rejected.type,
			payload: undefined,
			error: {},
		});
		expect(state.loading).toBe(false);
		expect(state.error).toBe('Ошибка подключения');
	});
});
