import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { checkAuthUser } from '@services/actions/auth';
import { selectIngredients, selectIsAuthChecked } from '@services/selectors';
import { AppHeader } from '@components/app-header/app-header';
import { AppRoutes } from '@components/routes/app-routes';

import '@/styles/global.css';
import { fetchIngredients } from '@services/actions/burger-ingredients.ts';

export const App = (): React.JSX.Element => {
	const dispatch = useAppDispatch();
	const isAuthChecked = useAppSelector(selectIsAuthChecked);
	const ingredients = useAppSelector(selectIngredients);

	// Загружаем ингредиенты при монтировании
	useEffect(() => {
		if (ingredients.length === 0) {
			dispatch(fetchIngredients());
		}
	}, [dispatch, ingredients.length]);

	// Проверяем авторизацию при загрузке приложения
	useEffect(() => {
		if (!isAuthChecked) {
			dispatch(checkAuthUser());
		}
	}, [dispatch, isAuthChecked]);

	return (
		<Router basename='/react-burger'>
			<AppHeader />
			<AppRoutes />
		</Router>
	);
};
