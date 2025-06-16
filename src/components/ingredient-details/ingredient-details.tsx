import React from 'react';
import styles from './ingredient-details.module.css';
import { TIngredient } from '@utils/types';

type TIngredientDetailsProps = {
	ingredient: TIngredient;
};

const CALORIES_AND_FCM: Record<
	'calories' | 'proteins' | 'fat' | 'carbohydrates',
	string
> = {
	calories: 'Калории, ккал',
	proteins: 'Белки, г',
	fat: 'Жиры, г',
	carbohydrates: 'Углеводы, г',
};

export const IngredientDetails = ({
	ingredient,
}: TIngredientDetailsProps): React.JSX.Element => {
	return (
		<div className={styles.container} data-testid='ingredient-details'>
			<img
				src={ingredient.image_large}
				alt={ingredient.name}
				className={styles.image}
			/>
			<p className='text text_type_main-medium mt-4 mb-8'>{ingredient.name}</p>
			<div className={styles.nutritionFacts}>
				{(
					Object.keys(CALORIES_AND_FCM) as Array<keyof typeof CALORIES_AND_FCM>
				).map((item, index) => (
					<div className={styles.fact} key={index}>
						<p className='text text_type_main-default text_color_inactive'>
							{CALORIES_AND_FCM[item]}
						</p>
						<p className='text text_type_digits-default text_color_inactive'>
							{ingredient[item]}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};
