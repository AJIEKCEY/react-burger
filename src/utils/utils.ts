export const getCookie = (name: string): string | undefined => {
	const matches = document.cookie.match(
		new RegExp(
			'(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'
		)
	);
	return matches ? decodeURIComponent(matches[1]) : undefined;
};

export const setCookie = (
	name: string,
	value: string,
	options: {
		expires?: number | Date | string;
		path?: string;
		domain?: string;
		secure?: boolean;
		sameSite?: 'Strict' | 'Lax' | 'None';
	} = {}
): void => {
	let updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

	for (const optionKey in options) {
		updatedCookie += `; ${optionKey}`;
		const optionValue = options[optionKey as keyof typeof options];

		if (optionValue !== true) {
			updatedCookie += `=${optionValue}`;
		}
	}

	document.cookie = updatedCookie;
};

export const deleteCookie = (name: string): void => {
	setCookie(name, '', {
		expires: -1,
		path: '/',
	});
};
