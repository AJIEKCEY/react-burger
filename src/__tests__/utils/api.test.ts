import {
	describe,
	it,
	expect,
	beforeEach,
	afterEach,
	vi,
	MockedFunction,
} from 'vitest';
import { apiRequest, api, ApiRequestError } from '@/utils/api';
import { createMockResponse } from '@/__tests__/test-utils';

vi.mock('@/services/token-service', () => ({
	tokenService: {
		getAuthHeader: vi.fn(),
	},
}));

vi.mock('@/services/websocket-manager', () => ({
	wsManager: {
		disconnect: vi.fn(),
		// можно добавить остальные моки если нужно
	},
}));

vi.mock('@/constants/api.ts', () => ({
	API_CONFIG: { BASE_URL: 'https://api.test.com' },
}));

const { tokenService } = await import('@/services/token-service');
const mockGetAuthHeader = tokenService.getAuthHeader as MockedFunction<
	() => string | null
>;

describe('apiRequest/vitest', () => {
	let fetchMock: MockedFunction<typeof fetch>;

	beforeEach(() => {
		fetchMock = vi.fn();
		global.fetch = fetchMock;

		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it('успешный обычный запрос', async () => {
		mockGetAuthHeader.mockReturnValue(null);
		const data = { success: true, data: { val: 11 } };
		fetchMock.mockResolvedValue(createMockResponse(data));
		const result = await apiRequest('/check');
		expect(fetchMock).toHaveBeenCalledWith('https://api.test.com/check', {
			headers: { 'Content-Type': 'application/json' },
		});
		expect(result).toEqual(data);
	});

	it('работа с авторизацией', async () => {
		mockGetAuthHeader.mockReturnValue('Bearer testt');
		const data = { success: true, data: { status: 1 } };
		fetchMock.mockResolvedValue(createMockResponse(data));
		await apiRequest('/auth-check');
		expect(fetchMock).toHaveBeenCalledWith('https://api.test.com/auth-check', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer testt',
			},
		});
	});

	it('обрабатывает пользовательские заголовки и их перекрытие', async () => {
		mockGetAuthHeader.mockReturnValue('Bearer test');
		const data = { success: true, data: {} };
		fetchMock.mockResolvedValue(createMockResponse(data));
		await apiRequest('/h', {
			headers: {
				'X-T': 'abc',
				'Content-Type': 'text/plain',
			},
		});
		expect(fetchMock).toHaveBeenCalledWith('https://api.test.com/h', {
			headers: {
				'Content-Type': 'text/plain',
				Authorization: 'Bearer test',
				'X-T': 'abc',
			},
		});
	});

	it('передает остальные опции fetch', async () => {
		mockGetAuthHeader.mockReturnValue(null);
		const data = { success: true, data: { x: 7 } };
		fetchMock.mockResolvedValue(createMockResponse(data));
		await apiRequest('/xx', {
			method: 'POST',
			body: '{"ok":1}',
			credentials: 'include',
		});
		expect(fetchMock).toHaveBeenCalledWith('https://api.test.com/xx', {
			method: 'POST',
			body: '{"ok":1}',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
		});
	});

	it('кидает ApiRequestError при http ошибке', async () => {
		fetchMock.mockResolvedValue({
			ok: false,
			status: 403,
			json: vi.fn(),
		} as never);
		await expect(apiRequest('/fail')).rejects.toThrow(ApiRequestError);
		await expect(apiRequest('/fail')).rejects.toThrow(
			'HTTP error! status: 403'
		);
	});

	it('кидает ApiRequestError при success: false (message)', async () => {
		fetchMock.mockResolvedValue(
			createMockResponse({ success: false, message: 'Ошибка API' })
		);
		await expect(apiRequest('/fail')).rejects.toThrow('Ошибка API');
	});

	it('кидает ApiRequestError при success: false (без message)', async () => {
		fetchMock.mockResolvedValue(createMockResponse({ success: false }));
		await expect(apiRequest('/fail')).rejects.toThrow(
			'Произошла ошибка при выполнении запроса'
		);
	});

	it('кидает ошибку сети (TypeError)', async () => {
		fetchMock.mockRejectedValue(new TypeError('Network down'));
		await expect(apiRequest('/net')).rejects.toThrow(
			'Ошибка сети. Проверьте подключение к интернету.'
		);
	});

	it('кидает ошибку неизвестного типа', async () => {
		fetchMock.mockRejectedValue({ foo: 1 });
		await expect(apiRequest('/unknown')).rejects.toThrow(
			'Произошла неизвестная ошибка'
		);
	});

	it('ApiRequestError пробрасывается как есть', async () => {
		const err = new ApiRequestError('CUSTOM');
		fetchMock.mockRejectedValue(err);
		await expect(apiRequest('/repeat')).rejects.toBe(err);
	});
});

describe('api helpers (vitest)', () => {
	let fetchMock: MockedFunction<typeof fetch>;
	beforeEach(() => {
		fetchMock = vi.fn();
		global.fetch = fetchMock;
		mockGetAuthHeader.mockReturnValue(null);
		vi.clearAllMocks();
	});

	it('api.get', async () => {
		const data = { success: true, data: { a: 1 } };
		fetchMock.mockResolvedValue(createMockResponse(data));
		await api.get('/r');
		expect(fetchMock).toHaveBeenCalledWith('https://api.test.com/r', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});
	});

	it('api.post', async () => {
		const data = { success: true, data: { val: 1 } };
		fetchMock.mockResolvedValue(createMockResponse(data));
		await api.post('/t', { a: 7 });
		expect(fetchMock).toHaveBeenCalledWith('https://api.test.com/t', {
			method: 'POST',
			body: JSON.stringify({ a: 7 }),
			headers: { 'Content-Type': 'application/json' },
		});
	});

	it('api.put', async () => {
		const data = { success: true, data: { val: 2 } };
		fetchMock.mockResolvedValue(createMockResponse(data));
		await api.put('/t', { b: 3 });
		expect(fetchMock).toHaveBeenCalledWith('https://api.test.com/t', {
			method: 'PUT',
			body: JSON.stringify({ b: 3 }),
			headers: { 'Content-Type': 'application/json' },
		});
	});

	it('api.patch', async () => {
		const data = { success: true, data: { val: 4 } };
		fetchMock.mockResolvedValue(createMockResponse(data));
		await api.patch('/t', { c: 5 });
		expect(fetchMock).toHaveBeenCalledWith('https://api.test.com/t', {
			method: 'PATCH',
			body: JSON.stringify({ c: 5 }),
			headers: { 'Content-Type': 'application/json' },
		});
	});

	it('api.delete', async () => {
		const data = { success: true, data: null };
		fetchMock.mockResolvedValue(createMockResponse(data));
		await api.delete('/del');
		expect(fetchMock).toHaveBeenCalledWith('https://api.test.com/del', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		});
	});
});

describe('ApiRequestError', () => {
	it('имеет корректный message и name', () => {
		const e = new ApiRequestError('fail');
		expect(e.message).toBe('fail');
		expect(e.name).toBe('ApiRequestError');
		expect(e instanceof ApiRequestError).toBe(true);
		expect(e instanceof Error).toBe(true);
	});
});
