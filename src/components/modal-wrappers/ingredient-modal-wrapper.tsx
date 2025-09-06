import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@hooks/redux.ts';
import { selectIngredients } from '@services/selectors.ts';
import { BaseModalWrapper } from '@components/modal-wrappers/base-modal-wrapper.tsx';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details.tsx';

export const IngredientModalWrapper: React.FC = () => {
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
		return (
			<BaseModalWrapper
				title='Ошибка'
				onClose={handleCloseModal}
				error='Ингредиент не найден'
			/>
		);
	}

	return (
		<BaseModalWrapper title='Детали ингредиента' onClose={handleCloseModal}>
			<IngredientDetails ingredient={ingredient} />
		</BaseModalWrapper>
	);
};
