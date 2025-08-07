import React, { useEffect } from 'react';
import { useAppSelector } from '@hooks/redux';
import { BurgerIngredientTabs } from '@components/burger-ingredients-tabs/burger-ingredients-tabs';
import { IngredientSection } from '@components/burger-ingredients-section/burger-ingredients-section';
import { useBurgerIngredients } from '@hooks/use-burger-ingredients';
import { useModal } from '@hooks/use-modal';
import { TIngredient } from '@/types/types';
import styles from './burger-ingredients.module.css';

export const BurgerIngredients = (): React.JSX.Element => {
	const { items, loading, error } = useAppSelector(
		(state) => state.burgerIngredients
	);
	const { activeTab, handleTabClick, handleScroll, containerRef, sectionRefs } =
		useBurgerIngredients();

	const { openIngredientModal } = useModal();

	// Группируем ингредиенты по типам
	const groupedIngredients = {
		bun: items.filter((item: TIngredient) => item.type === 'bun'),
		sauce: items.filter((item: TIngredient) => item.type === 'sauce'),
		main: items.filter((item: TIngredient) => item.type === 'main'),
	};

	// Подключаем обработчик прокрутки
	useEffect(() => {
		const container = containerRef.current;
		if (container) {
			container.addEventListener('scroll', handleScroll);
			return () => container.removeEventListener('scroll', handleScroll);
		}
	}, [containerRef, handleScroll]);

	const handleIngredientClick = (ingredient: TIngredient) => {
		openIngredientModal(ingredient);
	};

	if (loading) return <div>Загрузка...</div>;
	if (error) return <div>Ошибка: {error}</div>;

	return (
		<section className={styles.burger_ingredients}>
			<nav className='mb-10'>
				<BurgerIngredientTabs
					activeTab={activeTab}
					onTabClick={handleTabClick}
				/>
			</nav>
			<div
				ref={containerRef}
				className={`${styles.scroll} custom-scroll`}
				onScroll={handleScroll}>
				<IngredientSection
					ref={sectionRefs.bunRef}
					title='Булки'
					ingredients={groupedIngredients.bun}
					onIngredientClick={handleIngredientClick}
				/>
				<IngredientSection
					ref={sectionRefs.sauceRef}
					title='Соусы'
					ingredients={groupedIngredients.sauce}
					onIngredientClick={handleIngredientClick}
				/>
				<IngredientSection
					ref={sectionRefs.mainRef}
					title='Начинки'
					ingredients={groupedIngredients.main}
					onIngredientClick={handleIngredientClick}
				/>
			</div>
		</section>
	);
};
