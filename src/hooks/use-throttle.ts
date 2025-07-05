import { useCallback, useRef } from 'react';

/**
 * Хук для применения троттлинга к функции
 * @param callback Функция, к которой применяется троттлинг
 * @param delay Задержка в миллисекундах
 * @returns Функция с троттлингом
 */
export const useThrottle = <T extends (...args: never[]) => void>(
	callback: T,
	delay: number
): ((...args: Parameters<T>) => void) => {
	const lastCall = useRef<number>(0);
	const timeoutId = useRef<NodeJS.Timeout | null>(null);

	return useCallback(
		(...args: Parameters<T>) => {
			const now = Date.now();
			const elapsed = now - lastCall.current;

			// Очистка предыдущего таймаута если он существует
			if (timeoutId.current) {
				clearTimeout(timeoutId.current);
				timeoutId.current = null;
			}

			// Если прошло больше времени чем задержка, выполняем функцию сразу
			if (elapsed >= delay) {
				lastCall.current = now;
				callback(...args);
			} else {
				// Иначе откладываем выполнение
				timeoutId.current = setTimeout(() => {
					lastCall.current = Date.now();
					callback(...args);
				}, delay - elapsed);
			}
		},
		[callback, delay]
	);
};
