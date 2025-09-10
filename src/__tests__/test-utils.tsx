import { vi } from 'vitest';

/**
 * Легковесные утилиты для тестов, не зависящие от Redux/Router/DnD.
 * Для рендера компонентов используйте helpers из '@/__tests__/render-utils'.
 */

/**
 * Мокированные данные ингредиента для тестов
 */
export const mockIngredient = {
	_id: 'test-ingredient-id',
	name: 'Test Ingredient',
	type: 'main' as const,
	proteins: 100,
	fat: 50,
	carbohydrates: 30,
	calories: 200,
	price: 500,
	image: 'https://test.com/image.png',
	image_mobile: 'https://test.com/image-mobile.png',
	image_large: 'https://test.com/image-large.png',
	__v: 0,
};

/**
 * Мокированная булка для тестов
 */
export const mockBun = {
	...mockIngredient,
	_id: 'test-bun-id',
	name: 'Test Bun',
	type: 'bun' as const,
	price: 1000,
};

/**
 * Мокированный соус для тестов
 */
export const mockSauce = {
	...mockIngredient,
	_id: 'test-sauce-id',
	name: 'Test Sauce',
	type: 'sauce' as const,
	price: 100,
};

/**
 * Утилиты для мокирования localStorage
 */
export const mockLocalStorage = (() => {
	const store: Record<string, string> = {};

	return {
		getItem: vi.fn((key: string) => store[key] || null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value;
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			Object.keys(store).forEach((key) => delete store[key]);
		}),
		// Для доступа к данным в тестах
		__getStore: () => store,
	};
})();

/**
 * Создает мокированный Response для fetch запросов
 */
export const createMockResponse = (
	data: unknown,
	options: { status?: number; ok?: boolean } = {}
): Response => {
	const { status = 200, ok = true } = options;

	return {
		ok,
		status,
		statusText: ok ? 'OK' : 'Error',
		json: () => Promise.resolve(data),
		text: () => Promise.resolve(JSON.stringify(data)),
		headers: new Headers(),
		clone: vi.fn(),
		body: null,
		bodyUsed: false,
		redirected: false,
		type: 'basic' as ResponseType,
		url: '',
		arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
		blob: () => Promise.resolve(new Blob()),
		formData: () => Promise.resolve(new FormData()),
	} as Response;
};

/**
 * Утилита для мокирования fetch с разными сценариями
 */
export const mockFetch = {
	success: (data: unknown) => vi.fn(() => createMockResponse(data)),
	error: (status: number = 500) =>
		vi.fn(() =>
			createMockResponse({ error: 'Server Error' }, { status, ok: false })
		),
	networkError: () => vi.fn(() => Promise.reject(new Error('Network Error'))),
};

/**
 * Вспомогательная функция для ожидания следующего тика
 */
export const waitForNextUpdate = () =>
	new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Мокированный пользователь для тестов авторизации
 */
export const mockUser = {
	email: 'test@example.com',
	name: 'Test User',
};

/**
 * Мокированные токены
 */
export const mockTokens = {
	accessToken: 'mock-access-token',
	refreshToken: 'mock-refresh-token',
};
