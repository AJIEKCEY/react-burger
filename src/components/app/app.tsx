import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { AppHeader } from '@components/app-header/app-header';
import { Modal } from '@components/modal/modal';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { OrderDetails } from '@components/order-details/order-details';
import { Preloader } from '@components/preloader/preloader';
import { fetchIngredients } from '@services/actions/burger-ingredients';
import type { AppDispatch } from '@services/store';
import type { TIngredient, IInitialState } from '@/types/types';
import styles from './app.module.css';

export const App = (): React.JSX.Element => {
	const dispatch = useDispatch<AppDispatch>();
	const {
		items: ingredients,
		loading,
		error,
	} = useSelector((state: IInitialState) => state.burgerIngredients);
	const [selectedIngredient, setSelectedIngredient] =
		useState<TIngredient | null>(null);
	const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

	useEffect(() => {
		dispatch(fetchIngredients());
	}, [dispatch]);

	// const handleIngredientClick = (ingredient: TIngredient) => {
	// 	setSelectedIngredient(ingredient);
	// };

	const handleCloseModals = () => {
		setSelectedIngredient(null);
		setIsOrderModalOpen(false);
	};

	const handleOrderClick = () => {
		setIsOrderModalOpen(true);
	};

	return (
		<div className={styles.app}>
			<AppHeader />
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
				<BurgerConstructor
					ingredients={ingredients}
					onOrderClick={handleOrderClick}
				/>
			</main>

			{selectedIngredient && (
				<Modal title='Детали ингредиента' onClose={handleCloseModals}>
					<IngredientDetails ingredient={selectedIngredient} />
				</Modal>
			)}

			{isOrderModalOpen && (
				<Modal onClose={handleCloseModals}>
					<OrderDetails orderNumber={123456} />
				</Modal>
			)}
		</div>
	);
};
