import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@hooks/redux';
import { Loader } from '@components/loader/loader';
import {
	selectIsAuthenticated,
	selectIsAuthChecked,
} from '@services/selectors';

interface ProtectedRouteElementProps {
	element: React.ReactElement;
	anonymous?: boolean; // Маршруты, доступные только НЕавторизованным пользователям
}

export const ProtectedRouteElement: React.FC<ProtectedRouteElementProps> = ({
	element,
	anonymous = false,
}) => {
	const location = useLocation();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const isAuthChecked = useAppSelector(selectIsAuthChecked);

	// Пока идет проверка авторизации, показываем загрузку
	if (!isAuthChecked) {
		return <Loader text='Проверка авторизации...' />;
	}

	// Если маршрут только для неавторизованных пользователей (anonymous=true)
	// и пользователь авторизован - редирект на главную
	if (anonymous && isAuthenticated) {
		// Если пользователь пришел из защищенного маршрута, редиректим туда
		// иначе на главную
		const from = location.state?.from?.pathname || '/';
		return <Navigate to={from} replace />;
	}

	// Если маршрут защищенный (anonymous=false) и пользователь НЕ авторизован
	// редирект на логин с сохранением текущего пути
	if (!anonymous && !isAuthenticated) {
		return <Navigate to='/login' state={{ from: location }} replace />;
	}

	// Если все проверки пройдены, отображаем компонент
	return element;
};
