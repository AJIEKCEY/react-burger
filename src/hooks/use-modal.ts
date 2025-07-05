import { useAppDispatch, useAppSelector } from './redux';
import {
	openIngredientDetails,
	closeIngredientDetails,
	openOrderModal,
	closeOrderModal,
} from '@services/reducers/ingredient-modal';
import { TIngredient } from '@/types/types';

export const useModal = () => {
	const dispatch = useAppDispatch();
	const { ingredientDetails, orderDetails } = useAppSelector(
		(state) => state.modal
	);

	const handleOpenIngredientModal = (ingredient: TIngredient) => {
		dispatch(openIngredientDetails(ingredient));
	};

	const handleCloseIngredientModal = () => {
		dispatch(closeIngredientDetails());
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
