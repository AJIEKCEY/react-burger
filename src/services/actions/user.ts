import { createAsyncThunk } from '@reduxjs/toolkit';
import { api, apiRequest } from '@/utils/api';
import { API_ENDPOINTS } from '@/constants/api';
import { refreshToken } from '@services/actions/auth';
import { tokenService } from '@services/token-service';

// Типы для запросов и ответов
export interface UserResponse {
	success: boolean;
	user: {
		email: string;
		name: string;
	};
}

export interface UpdateUserRequest {
	email?: string;
	name?: string;
	password?: string;
}

export const checkAuthUser = createAsyncThunk(
	'auth/checkAuthUser',
	async (_, { dispatch, rejectWithValue }) => {
		try {
			const accessToken = tokenService.getAccessToken();
			const refreshTokenValue = tokenService.getRefreshToken();

			if (!refreshTokenValue) {
				return rejectWithValue('Нет токена обновления');
			}

			// Если access token истек, обновляем его
			if (!accessToken || tokenService.isTokenExpired(accessToken)) {
				await dispatch(refreshToken()).unwrap();
			}

			// Получаем данные пользователя
			return await api.get('/auth/user');
		} catch (error) {
			tokenService.clearTokens();
			return rejectWithValue('Ошибка проверки авторизации');
		}
	}
);

// Получение данных о пользователе
export const getUser = createAsyncThunk<
	UserResponse,
	void,
	{ rejectValue: string }
>('user/getUser', async (_, { rejectWithValue }) => {
	try {
		const response = await apiRequest<UserResponse>(API_ENDPOINTS.USER, {
			method: 'GET',
		});

		// Обновляем данные пользователя в куках
		if (response.user) {
			tokenService.setUserData(response.user);
		}

		return response;
	} catch (error) {
		return rejectWithValue(
			error instanceof Error
				? error.message
				: 'Ошибка получения данных пользователя'
		);
	}
});

// Обновление данных пользователя
export const updateUser = createAsyncThunk<
	UserResponse,
	UpdateUserRequest,
	{ rejectValue: string }
>('user/updateUser', async (userData, { rejectWithValue }) => {
	try {
		const response = await apiRequest<UserResponse>(API_ENDPOINTS.USER, {
			method: 'PATCH',
			body: JSON.stringify(userData),
		});

		// Обновляем данные пользователя в куках
		if (response.user) {
			tokenService.setUserData(response.user);
		}

		return response;
	} catch (error) {
		return rejectWithValue(
			error instanceof Error
				? error.message
				: 'Ошибка обновления данных пользователя'
		);
	}
});
