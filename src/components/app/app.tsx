import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { checkAuthUser } from '@services/actions/auth';
import { selectIsAuthChecked } from '@services/selectors';
import { AppHeader } from '@components/app-header/app-header';
import { AppRoutes } from '@components/routes/app-routes';

import '@/styles/global.css';

export const App = (): React.JSX.Element => {
	const dispatch = useAppDispatch();
	const isAuthChecked = useAppSelector(selectIsAuthChecked);

	// Проверяем авторизацию при загрузке приложения
	useEffect(() => {
		if (!isAuthChecked) {
			dispatch(checkAuthUser());
		}
	}, [dispatch, isAuthChecked]);

	return (
		<Router>
			<AppHeader />
			<AppRoutes />
		</Router>
	);
};
