import { useCallback, useRef } from 'react';

export const useThrottle = <T extends never[]>(
	callback: (...args: T) => void,
	delay: number
) => {
	const lastCall = useRef(0);

	return useCallback(
		(...args: T) => {
			const now = Date.now();
			if (now - lastCall.current >= delay) {
				lastCall.current = now;
				callback(...args);
			}
		},
		[callback, delay]
	);
};
