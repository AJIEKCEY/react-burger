import React from 'react';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import {
	ForgotPasswordPage,
	HomePage,
	IngredientPage,
	LoginPage,
	NotFoundPage,
	ProfilePage,
	RegisterPage,
	ResetPasswordPage,
	FeedPage,
	OrderPage,
} from '@/pages';
import { ProtectedRouteElement } from '@components/routes/protected-route.tsx';
import { ProtectedResetRoute } from '@components/routes/protected-reset-route.tsx';
import { UniversalOrderModalWrapper } from '@components/modal-wrappers/order-modal-wrapper.tsx';
import { IngredientModalWrapper } from '@components/modal-wrappers/ingredient-modal-wrapper.tsx';

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

				{/* Страницы ленты заказов */}
				<Route path='/feed' element={<FeedPage />} />
				<Route path='/feed/:number' element={<OrderPage />} />

				{/* Страница заказа профиля для прямого перехода */}
				<Route
					path='/profile/orders/:number'
					element={<ProtectedRouteElement element={<OrderPage />} />}
				/>

				{/* 404 страница */}
				<Route path='*' element={<NotFoundPage />} />
			</Routes>

			{/* Модальные маршруты - показываются поверх основного контента */}
			{background && (
				<Routes>
					<Route path='/ingredients/:id' element={<IngredientModalWrapper />} />
					<Route path='/orders/:number' element={<OrdersModalRoute />} />
					<Route path='/feed/:number' element={<FeedModalRoute />} />
					<Route
						path='/profile/orders/:number'
						element={
							<ProtectedRouteElement element={<ProfileOrdersModalRoute />} />
						}
					/>
				</Routes>
			)}
		</>
	);
};

// Простые компоненты-роуты
const OrdersModalRoute: React.FC = () => {
	const { number } = useParams<{ number: string }>();
	const location = useLocation();
	const orderNumber = number ? parseInt(number, 10) : undefined;
	const isNewOrder = location.state?.isNewOrder;

	return (
		<UniversalOrderModalWrapper
			orderNumber={orderNumber}
			fallbackPath='/'
			isNewOrder={isNewOrder}
		/>
	);
};

const FeedModalRoute: React.FC = () => {
	const { number } = useParams<{ number: string }>();
	const orderNumber = number ? parseInt(number, 10) : undefined;

	return (
		<UniversalOrderModalWrapper
			orderNumber={orderNumber}
			fallbackPath='/feed'
		/>
	);
};

const ProfileOrdersModalRoute: React.FC = () => {
	const { number } = useParams<{ number: string }>();
	const orderNumber = number ? parseInt(number, 10) : undefined;

	return (
		<UniversalOrderModalWrapper
			orderNumber={orderNumber}
			fallbackPath='/profile/orders'
		/>
	);
};
