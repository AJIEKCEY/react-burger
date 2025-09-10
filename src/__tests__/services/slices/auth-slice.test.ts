import reducer, {
	clearError,
	clearAuth,
	updateUserInfo,
} from '@services/slices/auth-slice';
import {
	loginUser,
	registerUser,
	logoutUser,
	refreshToken,
	checkAuthUser,
} from '@services/actions/auth';
import { getUser, updateUser } from '@services/actions/user';

// Простое начальное состояние (без токенов)
const initialState = {
	user: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,
	isAuthChecked: false,
};

// Пример пользователя
const user = { email: 'test@example.com', name: 'Test User' };

describe('authSlice', () => {
	it('возвращает initial state', () => {
		expect(reducer(undefined, { type: '' })).toEqual(
			expect.objectContaining({
				isAuthenticated: expect.any(Boolean),
				user: null, // либо результат tokenService.getUserData, если замокаешь
				isAuthChecked: false,
				isLoading: false,
				error: null,
			})
		);
	});

	it('clearError очищает ошибку', () => {
		const state = { ...initialState, error: 'Ошибка' };
		expect(reducer(state, clearError())).toEqual({
			...initialState,
			error: null,
		});
	});

	it('clearAuth сбрасывает user, токены и error', () => {
		const state = {
			...initialState,
			user,
			isAuthenticated: true,
			error: 'Ошибка',
		};
		const next = reducer(state, clearAuth());
		expect(next.user).toBe(null);
		expect(next.isAuthenticated).toBe(false);
		expect(next.error).toBe(null);
	});

	// -------- loginUser --------
	it('loginUser.pending - выставляет isLoading', () => {
		const action = { type: loginUser.pending.type };
		const state = reducer(initialState, action);
		expect(state.isLoading).toBe(true);
		expect(state.error).toBe(null);
	});

	it('loginUser.fulfilled - сохраняет пользователя, isAuthenticated', () => {
		const action = {
			type: loginUser.fulfilled.type,
			payload: { user },
		};
		const state = reducer(initialState, action);
		expect(state.user).toEqual(user);
		expect(state.isAuthenticated).toBe(true);
		expect(state.isLoading).toBe(false);
		expect(state.isAuthChecked).toBe(true);
		expect(state.error).toBe(null);
	});

	it('loginUser.rejected - очищает user и пишет ошибку', () => {
		const action = {
			type: loginUser.rejected.type,
			payload: 'Ошибка авторизации',
		};
		const state = reducer({ ...initialState, isLoading: true }, action);
		expect(state.user).toBe(null);
		expect(state.isAuthenticated).toBe(false);
		expect(state.error).toBe('Ошибка авторизации');
		expect(state.isLoading).toBe(false);
	});

	// -------- registerUser --------
	it('registerUser.fulfilled - сохраняет пользователя', () => {
		const action = {
			type: registerUser.fulfilled.type,
			payload: { user },
		};
		const state = reducer(initialState, action);
		expect(state.user).toEqual(user);
		expect(state.isAuthenticated).toBe(true);
		expect(state.isLoading).toBe(false);
		expect(state.error).toBe(null);
	});

	it('registerUser.rejected - очищает user и пишет ошибку', () => {
		const action = {
			type: registerUser.rejected.type,
			payload: 'Ошибка регистрации',
		};
		const state = reducer({ ...initialState, isLoading: true }, action);
		expect(state.user).toBe(null);
		expect(state.isAuthenticated).toBe(false);
		expect(state.error).toBe('Ошибка регистрации');
		expect(state.isLoading).toBe(false);
	});

	// -------- logoutUser --------
	it('logoutUser.fulfilled - сбрасывает isAuthenticated и user', () => {
		const state = {
			...initialState,
			user,
			isAuthenticated: true,
		};
		const action = { type: logoutUser.fulfilled.type };
		const next = reducer(state, action);
		expect(next.user).toBe(null);
		expect(next.isAuthenticated).toBe(false);
		expect(next.isLoading).toBe(false);
	});

	it('logoutUser.rejected - тоже сбрасывает user и isAuthenticated, пишет ошибку', () => {
		const state = {
			...initialState,
			user,
			isAuthenticated: true,
		};
		const action = { type: logoutUser.rejected.type, payload: 'Ошибка выхода' };
		const next = reducer(state, action);
		expect(next.user).toBe(null);
		expect(next.isAuthenticated).toBe(false);
		expect(next.error).toBe('Ошибка выхода');
		expect(next.isLoading).toBe(false);
	});

	// -------- refreshToken --------
	it('refreshToken.pending - выставляет isLoading', () => {
		const state = reducer(initialState, { type: refreshToken.pending.type });
		expect(state.isLoading).toBe(true);
		expect(state.error).toBe(null);
	});

	it('refreshToken.rejected - делает пользователя разлогиненым', () => {
		const state = reducer(
			{ ...initialState, user, isAuthenticated: true },
			{ type: refreshToken.rejected.type, payload: 'Ошибка токена' }
		);
		expect(state.user).toBe(null);
		expect(state.isAuthenticated).toBe(false);
		expect(state.error).toBe('Ошибка токена');
		expect(state.isLoading).toBe(false);
	});

	// -------- checkAuthUser --------
	it('checkAuthUser.fulfilled - восстанавливает юзера', () => {
		const action = {
			type: checkAuthUser.fulfilled.type,
			payload: { user },
		};
		const state = reducer(initialState, action);
		expect(state.user).toEqual(user);
		expect(state.isAuthenticated).toBe(true);
		expect(state.isAuthChecked).toBe(true);
		expect(state.error).toBe(null);
	});

	it('checkAuthUser.rejected - делает isAuthChecked true и очищает user', () => {
		const action = { type: checkAuthUser.rejected.type };
		const state = reducer(
			{ ...initialState, user, isAuthenticated: true },
			action
		);
		expect(state.user).toBe(null);
		expect(state.isAuthenticated).toBe(false);
		expect(state.isAuthChecked).toBe(true);
		expect(state.error).toBe(null);
	});

	// -------- getUser и updateUser --------
	it('getUser.fulfilled - обновляет user', () => {
		const action = { type: getUser.fulfilled.type, payload: { user } };
		const state = reducer(initialState, action);
		expect(state.user).toEqual(user);
	});

	it('updateUser.fulfilled - обновляет user', () => {
		const action = { type: updateUser.fulfilled.type, payload: { user } };
		const state = reducer(initialState, action);
		expect(state.user).toEqual(user);
	});

	// -------- updateUserInfo --------
	it('updateUserInfo.pending - isLoading true', () => {
		const state = reducer(initialState, { type: updateUserInfo.pending.type });
		expect(state.isLoading).toBe(true);
		expect(state.error).toBe(null);
	});

	it('updateUserInfo.fulfilled - обновляет user', () => {
		const action = { type: updateUserInfo.fulfilled.type, payload: user };
		const state = reducer(initialState, action);
		expect(state.user).toEqual(user);
		expect(state.isLoading).toBe(false);
	});

	it('updateUserInfo.rejected - пишет ошибку', () => {
		const action = {
			type: updateUserInfo.rejected.type,
			payload: 'Ошибка обновления',
		};
		const state = reducer({ ...initialState, isLoading: true }, action);
		expect(state.error).toBe('Ошибка обновления');
		expect(state.isLoading).toBe(false);
	});
});
