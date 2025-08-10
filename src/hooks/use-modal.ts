import { useAppDispatch, useAppSelector } from './redux';
import {
	openIngredientModal,
	closeIngredientModal,
	openOrderModal,
	closeOrderModal,
} from '@services/slices/modal-slice';
import { selectIngredientModal, selectOrderModal } from '@services/selectors';
import { TIngredient } from '@/types/types';

export const useModal = () => {
	const dispatch = useAppDispatch();
	const ingredientModal = useAppSelector(selectIngredientModal);
	const orderModal = useAppSelector(selectOrderModal);

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
		ingredientModal,
		orderModal,
		openIngredientModal: handleOpenIngredientModal,
		closeIngredientModal: handleCloseIngredientModal,
		openOrderModal: handleOpenOrderModal,
		closeOrderModal: handleCloseOrderModal,
	};
};
