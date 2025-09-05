import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrder } from '@hooks/use-order.ts';
import { OrderInfo } from '@components/order-info/order-info.tsx';
import { BaseModalWrapper } from '@components/modal-wrappers/base-modal-wrapper.tsx';
import { NewOrderModalWrapper } from '@components/modal-wrappers/new-order-modal-wrapper.tsx';

interface OrderModalWrapperProps {
	orderNumber?: number;
	fallbackPath: string;
	isNewOrder?: boolean;
}

export const UniversalOrderModalWrapper: React.FC<OrderModalWrapperProps> = ({
	orderNumber,
	fallbackPath,
	isNewOrder,
}) => {
	const location = useLocation();
	const navigate = useNavigate();
	const background = location.state?.background;

	const { order, loading, error } = useOrder(orderNumber);

	const handleCloseModal = () => {
		navigate(background || fallbackPath, { replace: true });
	};

	// Если новый заказ - показываем OrderDetails
	if (isNewOrder) {
		return <NewOrderModalWrapper onClose={handleCloseModal} />;
	}

	// Валидация номера заказа
	if (!orderNumber || isNaN(orderNumber)) {
		return (
			<BaseModalWrapper
				title='Ошибка'
				onClose={handleCloseModal}
				error='Некорректный номер заказа'
			/>
		);
	}

	// Заказ не найден
	if (!loading && !error && !order) {
		return (
			<BaseModalWrapper
				title='Заказ не найден'
				onClose={handleCloseModal}
				error={`Заказ #${orderNumber} не найден`}
			/>
		);
	}

	return (
		<BaseModalWrapper
			title={order ? `#${order.number}` : 'Загрузка заказа...'}
			onClose={handleCloseModal}
			loading={loading}
			error={error && !order ? error : undefined}>
			{order && <OrderInfo order={order} />}
		</BaseModalWrapper>
	);
};
