import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/api';
import { API_ENDPOINTS } from '@/constants/api';
import { tokenService } from '@/services/token-service';

// Типы для запросов и ответов
export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	name: string;
}

export interface AuthResponse {
	success: boolean;
	user: {
		email: string;
		name: string;
	};
	accessToken: string;
	refreshToken: string;
}

export interface LogoutRequest {
	token: string;
}

export interface LogoutResponse {
	success: boolean;
	message: string;
}

export interface RefreshTokenRequest {
	token: string;
}

export interface RefreshTokenResponse {
	success: boolean;
	accessToken: string;
	refreshToken: string;
}

// Действие для авторизации
export const loginUser = createAsyncThunk<
	AuthResponse,
	LoginRequest,
	{ rejectValue: string }
>('auth/login', async (loginData, { rejectWithValue }) => {
	try {
		const response = await apiRequest<AuthResponse>(API_ENDPOINTS.LOGIN, {
			method: 'POST',
			body: JSON.stringify(loginData),
		});

		// Сохраняем токены в куки
		if (response.accessToken && response.refreshToken) {
			const accessToken = response.accessToken.replace('Bearer ', '');
			tokenService.setTokens(accessToken, response.refreshToken);
		}

		// Сохраняем информацию о пользователе
		if (response.user) {
			localStorage.setItem('user', JSON.stringify(response.user));
		}

		return response;
	} catch (error) {
		return rejectWithValue(
			error instanceof Error ? error.message : 'Ошибка авторизации'
		);
	}
});

// Действие для регистрации
export const registerUser = createAsyncThunk<
	AuthResponse,
	RegisterRequest,
	{ rejectValue: string }
>('auth/register', async (registerData, { rejectWithValue }) => {
	try {
		const response = await apiRequest<AuthResponse>(API_ENDPOINTS.REGISTER, {
			method: 'POST',
			body: JSON.stringify(registerData),
		});

		// Сохраняем токены в куки
		if (response.accessToken && response.refreshToken) {
			const accessToken = response.accessToken.replace('Bearer ', '');
			tokenService.setTokens(accessToken, response.refreshToken);
		}

		// Сохраняем информацию о пользователе
		if (response.user) {
			localStorage.setItem('user', JSON.stringify(response.user));
		}

		return response;
	} catch (error) {
		return rejectWithValue(
			error instanceof Error ? error.message : 'Ошибка регистрации'
		);
	}
});

// Действие для выхода из системы
export const logoutUser = createAsyncThunk<
	LogoutResponse,
	void,
	{ rejectValue: string }
>('auth/logout', async (_, { rejectWithValue }) => {
	try {
		const refreshToken = localStorage.getItem('refreshToken');

		if (!refreshToken) {
			throw new Error('Токен не найден');
		}

		const response = await apiRequest<LogoutResponse>(API_ENDPOINTS.LOGOUT, {
			method: 'POST',
			body: JSON.stringify({ token: refreshToken }),
		});

		// Очищаем куки
		tokenService.clearTokens();

		// Очищаем localStorage
		localStorage.removeItem('user');

		return response;
	} catch (error) {
		// В случае ошибки все равно очищаем localStorage
		tokenService.clearTokens();
		localStorage.removeItem('user');

		return rejectWithValue(
			error instanceof Error ? error.message : 'Ошибка выхода из системы'
		);
	}
});

// Действие для обновления токена
export const refreshToken = createAsyncThunk<
	RefreshTokenResponse,
	void,
	{ rejectValue: string }
>('auth/refreshToken', async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem('refreshToken');

		if (!token) {
			throw new Error('Refresh token не найден');
		}

		const response = await apiRequest<RefreshTokenResponse>(
			API_ENDPOINTS.TOKEN,
			{
				method: 'POST',
				body: JSON.stringify({ token }),
			}
		);

		// Сохраняем новые токены
		if (response.accessToken && response.refreshToken) {
			const accessToken = response.accessToken.replace('Bearer ', '');
			tokenService.setTokens(accessToken, response.refreshToken);
		}

		return response;
	} catch (error) {
		// Если обновление токена не удалось, очищаем
		localStorage.removeItem('user');

		return rejectWithValue(
			error instanceof Error ? error.message : 'Ошибка обновления токена'
		);
	}
});

// Действие для проверки авторизации при загрузке приложения
export const checkAuthUser = createAsyncThunk<
	{ user: { email: string; name: string } },
	void,
	{ rejectValue: string }
>('auth/checkAuth', async (_, { rejectWithValue }) => {
	try {
		const accessToken = tokenService.getAccessToken();
		const userData = tokenService.getUserData();

		if (!accessToken || !userData) {
			throw new Error('Токен или пользователь не найдены');
		}

		return { user: userData };
	} catch (error) {
		tokenService.clearTokens();
		localStorage.removeItem('user');

		return rejectWithValue('Не авторизован');
	}
});
