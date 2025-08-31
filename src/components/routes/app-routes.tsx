import React from 'react';
import {
	Route,
	Routes,
	useLocation,
	useNavigate,
	useParams,
} from 'react-router-dom';
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
	FeedPage,
	OrderPage,
} from '@/pages';
import { Modal } from '@components/modal/modal';
import { ProtectedRouteElement } from '@components/routes/protected-route.tsx';
import { ProtectedResetRoute } from '@components/routes/protected-reset-route.tsx';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { OrderInfo } from '@components/order-info/order-info';
import { selectIngredients } from '@services/selectors.ts';

import { Loader } from '@components/loader/loader.tsx';
import { useOrder } from '@hooks/use-order';

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

				{/* 404 страница */}
				<Route path='*' element={<NotFoundPage />} />
			</Routes>

			{/* Модальные маршруты - показываются поверх основного контента */}
			{background && (
				<Routes>
					<Route path='/ingredients/:id' element={<IngredientModalWrapper />} />
					<Route path='/feed/:number' element={<OrderModalWrapper />} />
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

// Компонент-обёртка для модального окна заказа
const OrderModalWrapper: React.FC = () => {
	const { number } = useParams<{ number: string }>();
	const location = useLocation();
	const navigate = useNavigate();
	const background = location.state?.background;

	const orderNumber = number ? parseInt(number, 10) : undefined;
	const { order, loading, error } = useOrder(orderNumber);

	const handleCloseModal = () => {
		navigate(background || '/feed', { replace: true });
	};

	// Некорректный номер заказа
	if (!orderNumber || isNaN(orderNumber)) {
		return (
			<Modal title='Ошибка' onClose={handleCloseModal}>
				<div style={{ padding: '40px', textAlign: 'center' }}>
					<p className='text text_type_main-default text_color_inactive'>
						Некорректный номер заказа
					</p>
				</div>
			</Modal>
		);
	}

	// Загрузка
	if (loading) {
		return (
			<Modal title='Загрузка заказа...' onClose={handleCloseModal}>
				<div style={{ padding: '40px', textAlign: 'center' }}>
					<Loader />
				</div>
			</Modal>
		);
	}

	// Ошибка
	if (error && !order) {
		return (
			<Modal title='Ошибка' onClose={handleCloseModal}>
				<div style={{ padding: '40px', textAlign: 'center' }}>
					<p className='text text_type_main-default text_color_inactive'>
						{error}
					</p>
				</div>
			</Modal>
		);
	}

	// Заказ не найден
	if (!order) {
		return (
			<Modal title='Заказ не найден' onClose={handleCloseModal}>
				<div style={{ padding: '40px', textAlign: 'center' }}>
					<p className='text text_type_main-default text_color_inactive'>
						Заказ #{orderNumber} не найден
					</p>
				</div>
			</Modal>
		);
	}

	// Показываем заказ
	return (
		<Modal title={`#${order.number}`} onClose={handleCloseModal}>
			<OrderInfo order={order} />
		</Modal>
	);
};
