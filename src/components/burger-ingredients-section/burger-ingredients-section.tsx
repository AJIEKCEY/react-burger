import { forwardRef } from 'react';
import { BurgerIngredient } from '@components/burger-ingredient/burger-ingredient.tsx';
import { TIngredient } from '@/types/types';
import styles from './burger-ingredients-section.module.css';

interface IIngredientSectionProps {
	title: string;
	ingredients: TIngredient[];
}

export const IngredientSection = forwardRef<
	HTMLDivElement,
	IIngredientSectionProps
>(({ title, ingredients }, ref) => {
	return (
		<div ref={ref} className={styles.ingredients_group}>
			<h2 className='text text_type_main-medium mb-6'>{title}</h2>
			{ingredients.map((ingredient) => (
				<BurgerIngredient
					key={ingredient._id}
					//onIngredientClick={onIngredientClick}
					ingredient={ingredient}
				/>
			))}
		</div>
	);
});
