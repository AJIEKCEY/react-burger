import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './redux';
import { clearError } from '@services/slices/auth-slice';
import {
	selectAuthLoading,
	selectAuthError,
	selectIsAuthenticated,
} from '@services/selectors';
import { LocationWithState } from '@/types/types';

interface UseAuthFormReturn {
	// State
	isLoading: boolean;
	error: string | null;
	isAuthenticated: boolean;
	// Actions
	handleAuthSuccess: () => void;
	dispatch: ReturnType<typeof useAppDispatch>;
}

export const useAuthForm = (): UseAuthFormReturn => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation() as LocationWithState;

	const isLoading = useAppSelector(selectAuthLoading);
	const error = useAppSelector(selectAuthError);
	const isAuthenticated = useAppSelector(selectIsAuthenticated);

	// Редирект если пользователь уже авторизован
	useEffect(() => {
		if (isAuthenticated) {
			handleAuthSuccess();
		}
	}, [isAuthenticated]);

	// Очищаем ошибку при размонтировании компонента
	useEffect(() => {
		return () => {
			if (error) {
				dispatch(clearError());
			}
		};
	}, [dispatch, error]);

	/// Функция для обработки успешной авторизации
	const handleAuthSuccess = () => {
		const fromLocation = location.state?.from;

		// Если пользователь пришел с намерением сделать заказ
		if (location.state?.orderIntent && fromLocation) {
			// Возвращаем на страницу с заказом и автоматически отправляем заказ
			navigate(fromLocation.pathname || '/', {
				replace: true,
				state: { ...fromLocation.state, autoSubmitOrder: true },
			});
		} else {
			// Обычный редирект
			const redirectTo = fromLocation?.pathname || '/';
			navigate(redirectTo, { replace: true });
		}
	};

	return {
		isLoading,
		error,
		isAuthenticated,
		handleAuthSuccess,
		dispatch,
	};
};
