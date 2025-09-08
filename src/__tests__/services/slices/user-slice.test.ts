import reducer, { clearUserError } from '@services/slices/user-slice';
import { getUser, updateUser } from '@services/actions/user';
import type { UserProfileState } from '@services/slices/user-slice';

const initialState: UserProfileState = {
	isLoading: false,
	error: null,
	isUpdating: false,
};

describe('userSlice', () => {
	it('возвращает initialState', () => {
		expect(reducer(undefined, { type: '' })).toEqual(initialState);
	});

	it('clearUserError сбрасывает ошибку', () => {
		const modified = { ...initialState, error: 'fail' };
		const state = reducer(modified, clearUserError());
		expect(state.error).toBeNull();
	});

	describe('getUser', () => {
		it('pending: isLoading=true, error=null', () => {
			const prev = { ...initialState, error: 'Ошибка', isLoading: false };
			const state = reducer(prev, { type: getUser.pending.type });
			expect(state.isLoading).toBe(true);
			expect(state.error).toBeNull();
		});

		it('fulfilled: isLoading=false, error=null', () => {
			const prev = { ...initialState, isLoading: true, error: 'err' };
			const state = reducer(prev, { type: getUser.fulfilled.type });
			expect(state.isLoading).toBe(false);
			expect(state.error).toBeNull();
		});

		it('rejected: isLoading=false, пишет ошибку из payload', () => {
			const prev = { ...initialState, isLoading: true };
			const state = reducer(prev, {
				type: getUser.rejected.type,
				payload: 'Нет токена',
			});
			expect(state.isLoading).toBe(false);
			expect(state.error).toBe('Нет токена');
		});

		it('rejected: ошибка по умолчанию', () => {
			const prev = { ...initialState, isLoading: true };
			const state = reducer(prev, {
				type: getUser.rejected.type,
				payload: undefined,
			});
			expect(state.isLoading).toBe(false);
			expect(state.error).toBe('Ошибка получения данных пользователя');
		});
	});

	describe('updateUser', () => {
		it('pending: isUpdating=true, error=null', () => {
			const prev = { ...initialState, error: 'fail', isUpdating: false };
			const state = reducer(prev, { type: updateUser.pending.type });
			expect(state.isUpdating).toBe(true);
			expect(state.error).toBeNull();
		});

		it('fulfilled: isUpdating=false, error=null', () => {
			const prev = { ...initialState, isUpdating: true, error: 'err' };
			const state = reducer(prev, { type: updateUser.fulfilled.type });
			expect(state.isUpdating).toBe(false);
			expect(state.error).toBeNull();
		});

		it('rejected: isUpdating=false, пишет ошибку из payload', () => {
			const prev = { ...initialState, isUpdating: true };
			const state = reducer(prev, {
				type: updateUser.rejected.type,
				payload: 'Ошибка обновления',
			});
			expect(state.isUpdating).toBe(false);
			expect(state.error).toBe('Ошибка обновления');
		});

		it('rejected: ошибка по умолчанию', () => {
			const prev = { ...initialState, isUpdating: true };
			const state = reducer(prev, {
				type: updateUser.rejected.type,
				payload: undefined,
			});
			expect(state.isUpdating).toBe(false);
			expect(state.error).toBe('Ошибка обновления данных пользователя');
		});
	});
});
