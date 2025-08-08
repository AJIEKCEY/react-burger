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
			const redirectTo = location.state?.from?.pathname || '/';
			navigate(redirectTo, { replace: true });
		}
	}, [isAuthenticated, navigate, location]);

	// Очищаем ошибку при размонтировании компонента
	useEffect(() => {
		return () => {
			if (error) {
				dispatch(clearError());
			}
		};
	}, [dispatch, error]);

	// Функция для обработки успешной авторизации
	const handleAuthSuccess = () => {
		const redirectTo = location.state?.from?.pathname || '/';
		navigate(redirectTo, { replace: true });
	};

	return {
		isLoading,
		error,
		isAuthenticated,
		handleAuthSuccess,
		dispatch,
	};
};
