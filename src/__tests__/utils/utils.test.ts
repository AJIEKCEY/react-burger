import { describe, it, expect, beforeEach } from 'vitest';
import { getCookie, setCookie, deleteCookie } from '@/utils/utils';

describe('utils: cookie helpers', () => {
	let cookieValue = '';

	beforeEach(() => {
		// Мокаем document.cookie
		cookieValue = '';
		Object.defineProperty(document, 'cookie', {
			get: () => cookieValue,
			set: (v: string) => {
				// Имитация простейшего поведения cookie браузера (для наших целей ок)
				if (v.includes('=') && !v.includes('; expires=-1')) {
					cookieValue = v;
				}
				// Для deleteCookie всегда сбрасываем (эмулируем удаление)
				if (v.includes('; expires=-1')) {
					cookieValue = '';
				}
			},
			configurable: true,
		});
	});

	it('setCookie записывает cookie без опций', () => {
		setCookie('token', '123');
		expect(document.cookie).toContain('token=123');
	});

	it('setCookie экранирует имя и значение', () => {
		setCookie('u ser=12', 'v@l@e!');
		expect(document.cookie).toContain(
			encodeURIComponent('u ser=12') + '=' + encodeURIComponent('v@l@e!')
		);
	});

	it('setCookie добавляет опции', () => {
		setCookie('key', 'val', { path: '/', domain: 'test.com', secure: true });
		expect(document.cookie).toContain('key=val');
		expect(document.cookie).toContain('; path=/');
		expect(document.cookie).toContain('; domain=test.com');
		expect(document.cookie).toContain('; secure');
	});

	it('setCookie добавляет expires как строку', () => {
		setCookie('exp', '1', { expires: '2077-01-01' });
		expect(document.cookie).toContain('; expires=2077-01-01');
	});

	it('getCookie возвращает значение если оно есть', () => {
		cookieValue = 'token=abc123; other=def';
		expect(getCookie('token')).toBe('abc123');
	});

	it('getCookie корректно ищет сложные имена', () => {
		cookieValue = 't+e*s|t=wow; another=val';
		expect(getCookie('t+e*s|t')).toBe('wow');
	});

	it('getCookie возвращает undefined если нет cookie', () => {
		cookieValue = '';
		expect(getCookie('notfound')).toBeUndefined();
	});

	it('deleteCookie обнуляет cookie со сроком жизни в прошлом', () => {
		setCookie('toDel', 'willBeRemoved');
		expect(document.cookie).toContain('toDel=willBeRemoved');
		deleteCookie('toDel');
		expect(document.cookie).toBe('');
	});
});
