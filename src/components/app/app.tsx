import React, { useState, useEffect } from 'react';
import styles from './app.module.css';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { AppHeader } from '@components/app-header/app-header';
import { TIngredient } from '@utils/types';
import { useApi, TApiResponse } from '@hooks/useApi';
import { Modal } from '@components/modal/modal';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { OrderDetails } from '@components/order-details/order-details';
import { Preloader } from '@components/preloader/preloader';

const API_URL = 'https://norma.nomoreparties.space/api/ingredients';

export const App = (): React.JSX.Element => {
	const { loading, error, result } = useApi<TApiResponse>(API_URL);
	const [ingredients, setIngredients] = useState<TIngredient[]>([]);
	const [selectedIngredient, setSelectedIngredient] =
		useState<TIngredient | null>(null);
	const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

	useEffect(() => {
		if (!error && result) {
			setIngredients(result.data);
		}
	}, [result, error]);

	const handleIngredientClick = (ingredient: TIngredient) => {
		setSelectedIngredient(ingredient);
	};

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
				<main className={`${styles.main} pl-5 pr-5`}>
					<BurgerIngredients
						ingredients={ingredients}
						onIngredientClick={handleIngredientClick}
					/>
					<BurgerConstructor
						ingredients={ingredients}
						onOrderClick={handleOrderClick}
					/>
				</main>
			)}

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
