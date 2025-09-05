// src/components/modal-wrappers/new-order-modal-wrapper.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux.ts';
import { clearOrder } from '@services/slices/order-slice.ts';
import { BaseModalWrapper } from '@components/modal-wrappers/base-modal-wrapper.tsx';
import { OrderDetails } from '@components/order-details/order-details.tsx';

interface NewOrderModalWrapperProps {
	onClose: () => void;
}

export const NewOrderModalWrapper: React.FC<NewOrderModalWrapperProps> = ({
	onClose,
}) => {
	const dispatch = useAppDispatch();
	const { orderNumber, orderName, loading, error } = useAppSelector(
		(state) => state.order
	);

	const handleClose = () => {
		dispatch(clearOrder());
		onClose();
	};

	if (!orderNumber || !orderName) {
		return (
			<BaseModalWrapper
				title='Ошибка'
				onClose={handleClose}
				error='Данные заказа не найдены'
			/>
		);
	}

	return (
		<BaseModalWrapper
			title='Заказ оформлен'
			onClose={handleClose}
			loading={loading}
			error={error || undefined}>
			<OrderDetails orderNumber={orderNumber} orderName={orderName} />
		</BaseModalWrapper>
	);
};
