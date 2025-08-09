import React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@hooks/redux';
import {
	ForgotPasswordPage,
	HomePage,
	IngredientPage,
	LoginPage,
	NotFoundPage,
	ProfilePage,
	RegisterPage,
	ResetPasswordPage,
} from '@/pages';
import { Modal } from '@components/modal/modal';
import { ProtectedRouteElement } from '@components/routes/protected-route.tsx';
import { ProtectedResetRoute } from '@components/routes/protected-reset-route.tsx';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { OrderDetails } from '@components/order-details/order-details.tsx';
import { selectIngredients } from '@services/selectors.ts';

export const AppRoutes: React.FC = () => {
	const location = useLocation();
	const background = location.state?.background;

	return (
		<>
			{/* Основные маршруты - если есть background, показываем фоновую страницу */}
			<Routes location={background || location}>
				{/* Основная страница бургера */}
				<Route path='/' element={<HomePage />} />

				{/* Маршруты только для неавторизованных пользователей */}
				<Route
					path='/login'
					element={
						<ProtectedRouteElement element={<LoginPage />} anonymous={true} />
					}
				/>
				<Route
					path='/register'
					element={
						<ProtectedRouteElement
							element={<RegisterPage />}
							anonymous={true}
						/>
					}
				/>
				<Route
					path='/forgot-password'
					element={
						<ProtectedRouteElement
							element={<ForgotPasswordPage />}
							anonymous={true}
						/>
					}
				/>
				<Route
					path='/reset-password'
					element={
						<ProtectedRouteElement
							element={<ProtectedResetRoute element={<ResetPasswordPage />} />}
							anonymous={true}
						/>
					}
				/>

				{/* Защищенные маршруты */}
				<Route
					path='/profile'
					element={<ProtectedRouteElement element={<ProfilePage />} />}
				/>
				<Route
					path='/profile/*'
					element={<ProtectedRouteElement element={<ProfilePage />} />}
				/>

				{/* Страница ингредиента при прямом переходе (без background) */}
				<Route path='/ingredients/:id' element={<IngredientPage />} />

				{/* 404 страница */}
				<Route path='*' element={<NotFoundPage />} />
			</Routes>

			{/* Модальные маршруты - показываются поверх основного контента */}
			{background && (
				<Routes>
					<Route path='/ingredients/:id' element={<IngredientModalWrapper />} />
					<Route path='/orders/:number' element={<OrderModalWrapper />} />
				</Routes>
			)}
		</>
	);
};

// Компонент-обёртка для модального окна ингредиента
const IngredientModalWrapper: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const ingredients = useAppSelector(selectIngredients);
	const background = location.state?.background;

	const ingredientId = location.pathname.split('/')[2];
	const ingredient = ingredients.find((item) => item._id === ingredientId);

	const handleCloseModal = () => {
		navigate(background || '/', { replace: true });
	};

	if (!ingredient) {
		return null;
	}

	return (
		<Modal title='Детали ингредиента' onClose={handleCloseModal}>
			<IngredientDetails ingredient={ingredient} />
		</Modal>
	);
};

// Добавить компонент OrderModalWrapper:
const OrderModalWrapper: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const background = location.state?.background;

	// Получаем данные заказа из Redux состояния
	const { orderNumber, orderName } = useAppSelector((state) => state.order);

	const handleCloseModal = () => {
		navigate(background || '/', { replace: true });
	};

	// Проверяем, что данные заказа есть
	if (!orderNumber || !orderName) {
		return null;
	}

	return (
		<Modal title='Заказ оформлен' onClose={handleCloseModal}>
			<OrderDetails orderNumber={orderNumber} orderName={orderName} />
		</Modal>
	);
};
