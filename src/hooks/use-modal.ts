import { useAppDispatch, useAppSelector } from './redux';
import {
	openIngredientDetails,
	closeIngredientDetails,
} from '@services/reducers/ingredient-modal';
import { TIngredient } from '@/types/types';

export const useModal = () => {
	const dispatch = useAppDispatch();
	const modalState = useAppSelector((state) => state.modal);

	const openIngredientModal = (ingredient: TIngredient) => {
		dispatch(openIngredientDetails(ingredient));
	};

	const closeIngredientModal = () => {
		dispatch(closeIngredientDetails());
	};

	return {
		ingredientModal: modalState.ingredientDetails,
		openIngredientModal,
		closeIngredientModal,
	};
};
