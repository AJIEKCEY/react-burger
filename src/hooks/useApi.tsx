import axios, {
	AxiosRequestConfig,
	CancelTokenSource,
	isAxiosError,
} from 'axios';
import { useState, useEffect, useCallback, useRef } from 'react';
import { TIngredient } from '@/types/types';

export type TApiResponse = {
	success: boolean;
	data: TIngredient[];
};

interface UseApiResult<T> {
	loading: boolean;
	error: Error | null;
	result: T | undefined;
	refetch: () => Promise<void>;
}

/**
 * A custom hook for making API requests with built-in loading, error handling, and cancellation
 * @param url - The URL to fetch data from
 * @param options - Optional axios request configuration
 * @returns Object containing loading state, error state, result data, and refetch function
 */
export const useApi = <T,>(
	url: string,
	options?: AxiosRequestConfig
): UseApiResult<T> => {
	const [result, setResult] = useState<T | undefined>();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null);

	const fetchData = useCallback(async (): Promise<void> => {
		// Cancel any ongoing requests
		if (cancelTokenSourceRef.current) {
			cancelTokenSourceRef.current.cancel(
				'Request superseded by newer request'
			);
		}

		if (!url) {
			setResult(undefined);
			setLoading(false);
			return;
		}

		// Create a new cancel token for this request
		const source = axios.CancelToken.source();
		cancelTokenSourceRef.current = source;
		setLoading(true);
		setError(null);

		try {
			const response = await axios.get<T>(url, {
				...options,
				cancelToken: source.token,
			});
			setResult(response.data);
		} catch (err) {
			if (!axios.isCancel(err)) {
				const errorMessage = isAxiosError(err)
					? `API Error: ${err.response?.status} ${err.message}`
					: `Unknown error: ${err instanceof Error ? err.message : String(err)}`;

				console.error(errorMessage);
				setError(err instanceof Error ? err : new Error(String(err)));
			}
		} finally {
			setLoading(false);
		}
	}, [url, options]);

	useEffect(() => {
		fetchData();
		return () => {
			cancelTokenSourceRef.current?.cancel('Component unmounted');
		};
	}, [fetchData]);

	return { loading, error, result, refetch: fetchData };
};
