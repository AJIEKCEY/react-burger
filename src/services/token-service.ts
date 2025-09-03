import { getCookie, setCookie, deleteCookie } from '@/utils/utils';

class TokenService {
	private readonly ACCESS_TOKEN_KEY = 'accessToken';
	private readonly REFRESH_TOKEN_KEY = 'refreshToken';
	private readonly USER_DATA_KEY = 'user';

	// Получение access token
	getAccessToken(): string | null {
		return getCookie(this.ACCESS_TOKEN_KEY) || null;
	}

	// Получение refresh token
	getRefreshToken(): string | null {
		return getCookie(this.REFRESH_TOKEN_KEY) || null;
	}

	// Получение данных пользователя
	getUserData(): { email: string; name: string } | null {
		const userData = localStorage.getItem(this.USER_DATA_KEY);

		if (!userData) return null;

		try {
			return JSON.parse(userData);
		} catch {
			return null;
		}
	}

	// Сохранение токенов
	setTokens(accessToken: string, refreshToken: string): void {
		// Access token храним на 15 минут (обычное время жизни)
		const accessTokenExpires = new Date();
		accessTokenExpires.setMinutes(accessTokenExpires.getMinutes() + 15);

		// Refresh token храним на 7 дней
		const refreshTokenExpires = new Date();
		refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 7);

		setCookie(this.ACCESS_TOKEN_KEY, accessToken, {
			expires: accessTokenExpires,
			path: '/',
			secure: window.location.protocol === 'https:',
			sameSite: 'Strict',
		});

		setCookie(this.REFRESH_TOKEN_KEY, refreshToken, {
			expires: refreshTokenExpires,
			path: '/',
			secure: window.location.protocol === 'https:',
			sameSite: 'Strict',
		});
	}

	// Сохранение данных пользователя
	setUserData(userData: { email: string; name: string }): void {
		const expires = new Date();
		expires.setDate(expires.getDate() + 7); // 7 дней

		setCookie(this.USER_DATA_KEY, JSON.stringify(userData), {
			expires,
			path: '/',
			secure: window.location.protocol === 'https:',
			sameSite: 'Strict',
		});
	}

	// Очистка всех токенов и данных
	clearTokens(): void {
		deleteCookie(this.ACCESS_TOKEN_KEY);
		deleteCookie(this.REFRESH_TOKEN_KEY);
		deleteCookie(this.USER_DATA_KEY);
	}

	isTokenExpired(token: string): boolean {
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			return payload.exp * 1000 < Date.now();
		} catch {
			return true;
		}
	}

	// Проверка наличия токенов
	hasValidTokens(): boolean {
		const accessToken = this.getAccessToken();
		const refreshToken = this.getRefreshToken();

		if (!refreshToken) return false;

		// Если access token истек, но refresh token есть - это всё ещё валидное состояние
		if (!accessToken) return true;

		return !this.isTokenExpired(accessToken);
	}

	// Получение токена с префиксом Bearer для запросов
	getAuthHeader(): string | null {
		const token = this.getAccessToken();
		return token ? `Bearer ${token}` : null;
	}
}

export const tokenService = new TokenService();
