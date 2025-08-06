export const API_ENDPOINTS = {
	INGREDIENTS: '/ingredients',
	ORDERS: '/orders',
	REGISTER: '/auth/register',
	LOGIN: '/auth/login',
	FORGOT_PASSWORD: '/password-reset',
	RESET_PASSWORD: '/password-reset/reset',
	PROFILE: '/profile',
} as const;

export const API_CONFIG = {
	BASE_URL: 'https://norma.nomoreparties.space/api',
} as const;
