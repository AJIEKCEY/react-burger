import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LocationWithState } from '@/types/types.ts';

interface ProtectedResetRouteProps {
	element: React.ReactElement;
}

export const ProtectedResetRoute: React.FC<ProtectedResetRouteProps> = ({
	element,
}) => {
	const location = useLocation() as LocationWithState;

	// Проверяем, есть ли разрешение на доступ к странице сброса пароля
	const canResetPassword = location.state?.canResetPassword;

	// Если нет разрешения, редиректим на forgot-password
	if (!canResetPassword) {
		return <Navigate to='/forgot-password' replace />;
	}

	return element;
};
