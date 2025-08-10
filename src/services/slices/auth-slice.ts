import { createSlice } from '@reduxjs/toolkit';
import {
	loginUser,
	registerUser,
	logoutUser,
	refreshToken,
	checkAuthUser,
} from '../actions/auth';
import { getUser, updateUser } from '../actions/user';
import { tokenService } from '@services/token-service';

export interface User {
	email: string;
	name: string;
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	isAuthChecked: boolean; // Флаг для проверки, была ли проверена авторизация
}

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,
	isAuthChecked: false,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
		clearAuth: (state) => {
			state.user = null;
			state.isAuthenticated = false;
			state.error = null;
			tokenService.clearTokens();
			localStorage.removeItem('user');
		},
	},
	extraReducers: (builder) => {
		builder
			// Авторизация
			.addCase(loginUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload.user;
				state.isAuthenticated = true;
				state.error = null;
				state.isAuthChecked = true;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload || 'Ошибка авторизации';
				state.isAuthenticated = false;
				state.user = null;
			})

			// Регистрация
			.addCase(registerUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload.user;
				state.isAuthenticated = true;
				state.error = null;
				state.isAuthChecked = true;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload || 'Ошибка регистрации';
				state.isAuthenticated = false;
				state.user = null;
			})

			// Выход из системы
			.addCase(logoutUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.isLoading = false;
				state.user = null;
				state.isAuthenticated = false;
				state.error = null;
			})
			.addCase(logoutUser.rejected, (state, action) => {
				state.isLoading = false;
				// В случае ошибки все равно разлогиниваем пользователя
				state.user = null;
				state.isAuthenticated = false;
				state.error = action.payload || 'Ошибка выхода из системы';
			})

			// Обновление токена
			.addCase(refreshToken.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(refreshToken.fulfilled, (state) => {
				state.isLoading = false;
				state.error = null;
			})
			.addCase(refreshToken.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload || 'Ошибка обновления токена';
				state.user = null;
				state.isAuthenticated = false;
			})

			// Проверка авторизации
			.addCase(checkAuthUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(checkAuthUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload.user;
				state.isAuthenticated = true;
				state.isAuthChecked = true;
				state.error = null;
			})
			.addCase(checkAuthUser.rejected, (state) => {
				state.isLoading = false;
				state.user = null;
				state.isAuthenticated = false;
				state.isAuthChecked = true;
				state.error = null;
			})

			// Получение и обновление данных пользователя
			.addCase(getUser.fulfilled, (state, action) => {
				state.user = action.payload.user;
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				state.user = action.payload.user;
			});
	},
});

export const { clearError, clearAuth } = authSlice.actions;
export default authSlice.reducer;
