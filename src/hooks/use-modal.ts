import { useAppDispatch, useAppSelector } from './redux';
import {
	openIngredientModal,
	closeIngredientModal,
	openOrderModal,
	closeOrderModal,
} from '@services/slices/modal-slice';
import { TIngredient } from '@/types/types';

export const useModal = () => {
	const dispatch = useAppDispatch();
	const { ingredientDetails, orderDetails } = useAppSelector(
		(state) => state.modal
	);

	const handleOpenIngredientModal = (ingredient: TIngredient) => {
		dispatch(openIngredientModal(ingredient));
	};

	const handleCloseIngredientModal = () => {
		dispatch(closeIngredientModal());
	};

	const handleOpenOrderModal = (orderNumber: number, orderName: string) => {
		dispatch(openOrderModal({ orderNumber, orderName }));
	};

	const handleCloseOrderModal = () => {
		dispatch(closeOrderModal());
	};

	return {
		ingredientModal: ingredientDetails,
		orderModal: orderDetails,
		openIngredientModal: handleOpenIngredientModal,
		closeIngredientModal: handleCloseIngredientModal,
		openOrderModal: handleOpenOrderModal,
		closeOrderModal: handleCloseOrderModal,
	};
};
