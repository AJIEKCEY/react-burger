import { API_CONFIG } from '@/constants/api.ts';

const API_URL = API_CONFIG.BASE_URL;

// Типы для ответов API
export interface ApiResponse<T = unknown> {
	success: boolean;
	data: T;
	message?: string;
}

// Типы для ошибок
export interface ApiError {
	success: false;
	message: string;
}

// Класс для работы с API ошибками
export class ApiRequestError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ApiRequestError';
	}
}

// Основная функция для API запросов
export const apiRequest = async <T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> => {
	const url = `${API_URL}${endpoint}`;

	// Устанавливаем базовые заголовки
	const defaultHeaders = {
		'Content-Type': 'application/json',
	};

	const config: RequestInit = {
		...options,
		headers: {
			...defaultHeaders,
			...options.headers,
		},
	};

	try {
		const response = await fetch(url, config);

		// Проверяем статус ответа
		if (!response.ok) {
			throw new ApiRequestError(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		// Проверяем успешность ответа по полю success
		if (data.success === false) {
			throw new ApiRequestError(
				data.message || 'Произошла ошибка при выполнении запроса'
			);
		}

		return data;
	} catch (error) {
		// Обработка различных типов ошибок
		if (error instanceof ApiRequestError) {
			throw error;
		}

		if (error instanceof TypeError) {
			throw new ApiRequestError(
				'Ошибка сети. Проверьте подключение к интернету.'
			);
		}

		throw new ApiRequestError('Произошла неизвестная ошибка');
	}
};

// Вспомогательные функции для различных HTTP методов
export const api = {
	get: <T>(endpoint: string, options?: RequestInit) =>
		apiRequest<T>(endpoint, { ...options, method: 'GET' }),

	post: <T>(endpoint: string, data: object, options?: RequestInit) =>
		apiRequest<T>(endpoint, {
			...options,
			method: 'POST',
			body: JSON.stringify(data),
		}),

	put: <T>(endpoint: string, data: object, options?: RequestInit) =>
		apiRequest<T>(endpoint, {
			...options,
			method: 'PUT',
			body: JSON.stringify(data),
		}),

	delete: <T>(endpoint: string, options?: RequestInit) =>
		apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
