import { describe, it, expect, beforeEach, vi, afterEach, Mock } from 'vitest';

vi.mock('@/utils/utils', () => ({
	getCookie: vi.fn(),
	setCookie: vi.fn(),
	deleteCookie: vi.fn(),
}));

import { tokenService } from '@/services/token-service';
import * as utils from '@/utils/utils';

describe('TokenService', () => {
	beforeEach(() => {
		(utils.getCookie as unknown as ReturnType<typeof vi.fn>).mockReset();
		(utils.setCookie as unknown as ReturnType<typeof vi.fn>).mockReset();
		(utils.deleteCookie as unknown as ReturnType<typeof vi.fn>).mockReset();
		vi.restoreAllMocks();

		// Мокаем localStorage
		const store = {} as Record<string, string>;
		vi.stubGlobal('localStorage', {
			getItem: vi.fn((key: string) => store[key] ?? null),
			setItem: vi.fn((key: string, value: string) => {
				store[key] = value;
			}),
			removeItem: vi.fn((key: string) => {
				delete store[key];
			}),
		});
		// Мокаем window.location.protocol для secure опции
		vi.stubGlobal('window', { location: { protocol: 'https:' } });
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it('getAccessToken читает accessToken через getCookie', () => {
		vi.mocked(utils.getCookie).mockReturnValue('abc');
		expect(tokenService.getAccessToken()).toBe('abc');
		expect(utils.getCookie).toHaveBeenCalledWith('accessToken');
	});
	it('getAccessToken возвращает null, если нет cookie', () => {
		vi.mocked(utils.getCookie).mockReturnValue(undefined);
		expect(tokenService.getAccessToken()).toBeNull();
	});

	it('getRefreshToken читает refreshToken через getCookie', () => {
		vi.mocked(utils.getCookie).mockReturnValue('refresh');
		expect(tokenService.getRefreshToken()).toBe('refresh');
		expect(utils.getCookie).toHaveBeenCalledWith('refreshToken');
	});

	it('getUserData возвращает распарсенные данные, если есть в localStorage', () => {
		const user = { email: 'test@ya.ru', name: 'Test' };
		(localStorage.getItem as Mock).mockReturnValueOnce(JSON.stringify(user));
		expect(tokenService.getUserData()).toEqual(user);
	});

	it('getUserData возвращает null, если ничего нет', () => {
		(localStorage.getItem as Mock).mockReturnValueOnce(null);
		expect(tokenService.getUserData()).toBeNull();
	});
	it('getUserData возвращает null при кривом JSON', () => {
		(localStorage.getItem as Mock).mockReturnValueOnce('{notJson}');
		expect(tokenService.getUserData()).toBeNull();
	});

	it('setTokens вызывает setCookie для accessToken/refreshToken с нужными опциями', () => {
		tokenService.setTokens('at', 'rt');
		expect(utils.setCookie).toHaveBeenCalledWith(
			'accessToken',
			'at',
			expect.objectContaining({ path: '/', secure: true, sameSite: 'Strict' })
		);
		expect(utils.setCookie).toHaveBeenCalledWith(
			'refreshToken',
			'rt',
			expect.objectContaining({ path: '/', secure: true, sameSite: 'Strict' })
		);
	});

	it('setUserData вызывает setCookie с нужными опциями', () => {
		const user = { email: 'a', name: 'b' };
		tokenService.setUserData(user);
		expect(utils.setCookie).toHaveBeenCalledWith(
			'user',
			JSON.stringify(user),
			expect.objectContaining({ path: '/', secure: true, sameSite: 'Strict' })
		);
	});

	it('clearTokens вызывает deleteCookie для всех ключей', () => {
		tokenService.clearTokens();
		expect(utils.deleteCookie).toHaveBeenCalledWith('accessToken');
		expect(utils.deleteCookie).toHaveBeenCalledWith('refreshToken');
		expect(utils.deleteCookie).toHaveBeenCalledWith('user');
	});

	it('isTokenExpired возвращает true при неправильном токене', () => {
		expect(tokenService.isTokenExpired('broken')).toBe(true);
	});

	it('isTokenExpired возвращает true/false по exp из jwt payload', () => {
		// Токен с exp менее текущей даты
		const expiredPayload = btoa(
			JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 10 })
		);
		const tokenExpired = `a.${expiredPayload}.b`;
		expect(tokenService.isTokenExpired(tokenExpired)).toBe(true);

		// Токен c exp больше текущей даты
		const validPayload = btoa(
			JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 1000 })
		);
		const tokenValid = `a.${validPayload}.b`;
		expect(tokenService.isTokenExpired(tokenValid)).toBe(false);

		// Нет exp
		const noExp = btoa(JSON.stringify({ foo: 1 }));
		const tokenNoExp = `a.${noExp}.b`;
		expect(tokenService.isTokenExpired(tokenNoExp)).toBe(true);
	});

	it('hasValidTokens возвращает false если нет refreshToken', () => {
		vi.mocked(utils.getCookie).mockImplementation((key) =>
			key === 'refreshToken' ? undefined : 'something'
		);
		expect(tokenService.hasValidTokens()).toBe(false);
	});
	it('hasValidTokens возвращает true если есть refreshToken и нет accessToken', () => {
		vi.mocked(utils.getCookie).mockImplementation((key) =>
			key === 'refreshToken' ? 'r' : undefined
		);
		expect(tokenService.hasValidTokens()).toBe(true);
	});
	it('hasValidTokens возвращает false если accessToken истёк', () => {
		const expiredPayload = btoa(
			JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 10 })
		);
		vi.mocked(utils.getCookie).mockImplementation((key) =>
			key === 'refreshToken' ? 'validrefresh' : `a.${expiredPayload}.b`
		);
		expect(tokenService.hasValidTokens()).toBe(false);
	});
	it('hasValidTokens возвращает true если accessToken валиден', () => {
		const validPayload = btoa(
			JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 1000 })
		);
		vi.mocked(utils.getCookie).mockImplementation((key) =>
			key === 'refreshToken' ? 'validrefresh' : `a.${validPayload}.b`
		);
		expect(tokenService.hasValidTokens()).toBe(true);
	});

	it('getAuthHeader возвращает Bearer ... если accessToken есть', () => {
		vi.mocked(utils.getCookie).mockReturnValue('tok123');
		expect(tokenService.getAuthHeader()).toBe('Bearer tok123');
	});
	it('getAuthHeader возвращает null, если токена нет', () => {
		vi.mocked(utils.getCookie).mockReturnValue(undefined);
		expect(tokenService.getAuthHeader()).toBeNull();
	});

	describe('ensureValidToken', () => {
		it('возвращает существующий accessToken если он ещё валиден', async () => {
			const validPayload = btoa(
				JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 1000 })
			);
			vi.mocked(utils.getCookie).mockImplementation((key) =>
				key === 'accessToken' ? `a.${validPayload}.b` : 'rrr'
			);
			expect(await tokenService.ensureValidToken()).toBe(`a.${validPayload}.b`);
		});
		it('возвращает null если нет refreshToken', async () => {
			vi.mocked(utils.getCookie).mockImplementation(() => undefined);
			expect(await tokenService.ensureValidToken()).toBeNull();
		});
		it('очищает токены и возвращает null если refreshToken истёк', async () => {
			const expiredPayload = btoa(
				JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 10 })
			);
			vi.mocked(utils.getCookie).mockImplementation((key) =>
				key === 'refreshToken' ? `a.${expiredPayload}.b` : undefined
			);
			const clearSpy = vi.spyOn(tokenService, 'clearTokens');
			expect(await tokenService.ensureValidToken()).toBeNull();
			expect(clearSpy).toHaveBeenCalled();
		});
		it('делает попытку обновления токена через fetch', async () => {
			vi.mocked(utils.getCookie).mockImplementation((key) => {
				if (key === 'accessToken') return undefined;
				if (key === 'refreshToken') {
					const validPayload = btoa(
						JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 1000 })
					);
					return `a.${validPayload}.b`;
				}
				return undefined;
			});
			const fakeAccess = 'newAcc';
			const fakeRefresh = 'newRef';
			const jsonMock = vi.fn().mockResolvedValue({
				accessToken: fakeAccess,
				refreshToken: fakeRefresh,
			});
			global.fetch = vi
				.fn()
				.mockResolvedValue({ ok: true, json: jsonMock } as unknown as Response);

			const setTokensSpy = vi.spyOn(tokenService, 'setTokens');
			const result = await tokenService.ensureValidToken();

			expect(global.fetch).toHaveBeenCalledWith(
				'/api/auth/token',
				expect.anything()
			);
			expect(setTokensSpy).toHaveBeenCalledWith(fakeAccess, fakeRefresh);
			expect(result).toBe(fakeAccess);
		});
		it('при ошибке запроса очищает токены и возвращает null', async () => {
			const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			vi.mocked(utils.getCookie).mockImplementation((key) => {
				if (key === 'accessToken') return undefined;
				const validPayload = btoa(
					JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 1000 })
				);
				return `a.${validPayload}.b`;
			});
			global.fetch = vi.fn().mockRejectedValue(new Error('fail'));
			const clearSpy = vi.spyOn(tokenService, 'clearTokens');
			expect(await tokenService.ensureValidToken()).toBeNull();
			expect(clearSpy).toHaveBeenCalled();
			errorSpy.mockRestore(); // Восстановить после теста (чтобы не сломать другие)
		});
		it('если api ответил ошибкой - очищает токены и возвращает null', async () => {
			vi.mocked(utils.getCookie).mockImplementation((key) => {
				if (key === 'accessToken') return undefined;
				const validPayload = btoa(
					JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 1000 })
				);
				return `a.${validPayload}.b`;
			});
			global.fetch = vi
				.fn()
				.mockResolvedValue({ ok: false } as unknown as Response);
			const clearSpy = vi.spyOn(tokenService, 'clearTokens');
			expect(await tokenService.ensureValidToken()).toBeNull();
			expect(clearSpy).toHaveBeenCalled();
		});
	});
});
