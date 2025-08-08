import React, { useEffect } from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
	useNavigate,
} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { checkAuthUser } from '@services/actions/auth';
import { selectIsAuthChecked, selectIngredients } from '@services/selectors';
import { Modal } from '@components/modal/modal';
import {
	HomePage,
	LoginPage,
	RegisterPage,
	ForgotPasswordPage,
	ResetPasswordPage,
	ProfilePage,
	IngredientPage,
	NotFoundPage,
} from '@/pages';
import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { ProtectedRouteElement } from '@components/protected-route/protected-route';

import '@/styles/global.css';
import { OrderDetails } from '@components/order-details/order-details.tsx';

const AppRoutes: React.FC = () => {
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
							element={<ResetPasswordPage />}
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
