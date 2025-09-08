import reducer, {
	wsConnecting,
	wsConnected,
	wsDisconnected,
	wsError,
	wsMessage,
	clearFeed,
	forceDisconnect,
	connectFeed,
	disconnectFeed,
} from '@services/slices/feed-slice';

const exampleOrder = {
	ingredients: ['abc123', 'def456'],
	_id: 'order123',
	status: 'created' as const,
	number: 42,
	createdAt: '2024-04-22T10:00:00.000Z',
	updatedAt: '2024-04-22T10:01:00.000Z',
	name: 'Тестовый заказ',
};

const initialState = {
	orders: [],
	total: 0,
	totalToday: 0,
	loading: false,
	error: null,
	connected: false,
};

const feedData = {
	success: true,
	orders: [exampleOrder],
	total: 100,
	totalToday: 12,
};

describe('feedSlice', () => {
	it('возвращает initialState', () => {
		expect(reducer(undefined, { type: '' })).toEqual(initialState);
	});

	it('wsConnecting устанавливает loading=true, error=null', () => {
		const state = reducer(initialState, wsConnecting());
		expect(state.loading).toBe(true);
		expect(state.error).toBeNull();
	});

	it('wsConnected делает connected=true, loading=false, error=null', () => {
		const modified = { ...initialState, loading: true, error: 'err' };
		const state = reducer(modified, wsConnected());
		expect(state.connected).toBe(true);
		expect(state.loading).toBe(false);
		expect(state.error).toBeNull();
	});

	it('wsDisconnected делает connected=false', () => {
		const state = reducer(
			{ ...initialState, connected: true },
			wsDisconnected()
		);
		expect(state.connected).toBe(false);
	});

	it('wsError пишет ошибку, connected=false, loading=false', () => {
		const state = reducer(
			{ ...initialState, connected: true, loading: true },
			wsError('fail')
		);
		expect(state.error).toBe('fail');
		expect(state.connected).toBe(false);
		expect(state.loading).toBe(false);
	});

	it('wsMessage с success=true обновляет заказы и total', () => {
		const preState = {
			...initialState,
			loading: true,
			orders: [],
			total: 0,
			totalToday: 0,
		};
		const state = reducer(preState, wsMessage(feedData));
		expect(state.orders).toEqual(feedData.orders);
		expect(state.total).toBe(feedData.total);
		expect(state.totalToday).toBe(feedData.totalToday);
		expect(state.loading).toBe(false);
	});

	it('wsMessage с success=false не меняет заказы', () => {
		const preOrders = [exampleOrder];
		const preState = {
			...initialState,
			orders: preOrders,
			total: 5,
			totalToday: 1,
			loading: true,
		};
		const payload = { ...feedData, success: false };
		const state = reducer(preState, wsMessage(payload));
		expect(state.orders).toEqual(preOrders);
		expect(state.total).toBe(5);
		expect(state.totalToday).toBe(1);
		// loading не сбрасывается, потому что действие не обработано
	});

	it('clearFeed очищает заказы и счетчики', () => {
		const filled = {
			...initialState,
			orders: [exampleOrder],
			total: 25,
			totalToday: 5,
		};
		const state = reducer(filled, clearFeed());
		expect(state.orders).toEqual([]);
		expect(state.total).toBe(0);
		expect(state.totalToday).toBe(0);
	});

	it('connectFeed.pending ставит loading true и error null', () => {
		const state = reducer(initialState, { type: connectFeed.pending.type });
		expect(state.loading).toBe(true);
		expect(state.error).toBeNull();
	});

	it('connectFeed.rejected ставит loading false и error', () => {
		const state = reducer(initialState, {
			type: connectFeed.rejected.type,
			payload: 'Нет соединения',
			error: { message: 'err' },
		});
		expect(state.loading).toBe(false);
		expect(state.error).toBe('Нет соединения');
	});

	it('connectFeed.rejected fallback по error.message', () => {
		const state = reducer(initialState, {
			type: connectFeed.rejected.type,
			payload: undefined,
			error: { message: 'err-msg' },
		});
		expect(state.error).toBe('err-msg');
	});

	it('connectFeed.rejected fallback по строке по умолчанию', () => {
		const state = reducer(initialState, {
			type: connectFeed.rejected.type,
			payload: undefined,
			error: {},
		});
		expect(state.error).toBe('Ошибка подключения');
	});

	it('disconnectFeed.fulfilled делает connected false', () => {
		const state = reducer(
			{ ...initialState, connected: true },
			{
				type: disconnectFeed.fulfilled.type,
			}
		);
		expect(state.connected).toBe(false);
	});

	it('disconnectFeed.rejected делает connected false и пишет ошибку', () => {
		const state = reducer(
			{ ...initialState, connected: true },
			{
				type: disconnectFeed.rejected.type,
				payload: 'Отключение не удалось',
				error: { message: undefined },
			}
		);
		expect(state.connected).toBe(false);
		expect(state.error).toBe('Отключение не удалось');
	});

	it('disconnectFeed.rejected с дефолтом ошибки', () => {
		const state = reducer(initialState, {
			type: disconnectFeed.rejected.type,
			payload: undefined,
			error: {},
		});
		expect(state.connected).toBe(false);
		expect(state.error).toBe('Ошибка при отключении');
	});

	it('forceDisconnect не ломает состояние (этот экшн не трогает стейт)', () => {
		const filled = {
			...initialState,
			orders: [exampleOrder],
			total: 33,
			totalToday: 7,
			connected: true,
		};
		const state = reducer(filled, forceDisconnect());
		expect(state).toEqual(filled);
	});
});
