import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/api';
import { API_ENDPOINTS } from '@/constants/api';
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
