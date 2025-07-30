import { forwardRef } from 'react';
import { BurgerIngredient } from '@components/burger-ingredient/burger-ingredient.tsx';
import { TIngredient } from '@/types/types';
import styles from './burger-ingredients-section.module.css';

interface IIngredientSectionProps {
	title: string;
	ingredients: TIngredient[];
	onIngredientClick?: (ingredient: TIngredient) => void;
}

export const IngredientSection = forwardRef<
	HTMLDivElement,
	IIngredientSectionProps
>(({ title, ingredients, onIngredientClick }, ref) => {
	const handleIngredientClick = (ingredient: TIngredient) => {
		console.log('IngredientSection: ingredient clicked:', ingredient.name); // Отладка
		onIngredientClick?.(ingredient);
	};

	return (
		<div ref={ref} className={styles.ingredients_group}>
			<h2 className='text text_type_main-medium mb-6'>{title}</h2>
			{ingredients.map((ingredient) => (
				<BurgerIngredient
					key={ingredient._id}
					ingredient={ingredient}
					onIngredientClick={handleIngredientClick}
				/>
			))}
		</div>
	);
});
