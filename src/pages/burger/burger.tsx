import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { Modal } from '@components/modal/modal';
import { useModal } from '@hooks/use-modal';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { OrderDetails } from '@components/order-details/order-details';
import { Preloader } from '@components/preloader/preloader';
import { fetchIngredients } from '@services/actions/burger-ingredients';
import styles from './burger.module.css';
import '@/styles/global.css';

export const BurgerPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const { loading, error } = useAppSelector((state) => state.burgerIngredients);

	const { ingredientModal, orderModal, closeIngredientModal, closeOrderModal } =
		useModal();

	useEffect(() => {
		dispatch(fetchIngredients());
	}, [dispatch]);

	return (
		<>
			<h1
				className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
				Соберите бургер
			</h1>
			<main className={`${styles.main} pl-5 pr-5`}>
				{loading ? (
					<div className={styles.loaderContainer}>
						<Preloader />
					</div>
				) : error ? (
					<div className={styles.errorContainer}>
						<p className='text text_type_main-medium text_color_error'>
							Ошибка загрузки данных. Попробуйте обновить страницу.
						</p>
					</div>
				) : (
					<BurgerIngredients />
				)}
				<BurgerConstructor />
			</main>

			{ingredientModal?.isOpen && (
				<Modal onClose={closeIngredientModal} title='Детали ингредиента'>
					{ingredientModal.ingredient && (
						<IngredientDetails ingredient={ingredientModal.ingredient} />
					)}
				</Modal>
			)}

			{/* Модальное окно заказа */}
			{orderModal?.isOpen && (
				<Modal onClose={closeOrderModal}>
					<OrderDetails
						orderNumber={orderModal.orderNumber!}
						orderName={orderModal.orderName!}
					/>
				</Modal>
			)}
		</>
	);
};
