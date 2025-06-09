import React from 'react';
import styles from './burger-ingredients.module.css';
import { TIngredient } from '@utils/types.ts';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import { BurgerIngredient } from '@components/burger-ingredient/burger-ingredient.tsx';

type TBurgerIngredientsProps = {
	ingredients: TIngredient[];
};

export const BurgerIngredients = ({
	ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
	console.log(ingredients);

	return (
		<section className={styles.burger_ingredients}>
			<nav className='mb-10'>
				<ul className={styles.menu}>
					<Tab value='bun' active={true} onClick={() => {}}>
						Булки
					</Tab>
					<Tab value='sauce' active={false} onClick={() => {}}>
						Соусы
					</Tab>
					<Tab value='main' active={false} onClick={() => {}}>
						Начинки
					</Tab>
				</ul>
			</nav>
			<div className={styles.scroll}>
				<div className={styles.ingredients_group}>
					<h2 className='text text_type_main-medium mb-6'>Булки</h2>
					{ingredients
						.filter((ingredient) => ingredient.type === 'bun')
						.map((ingredient) => (
							<BurgerIngredient key={ingredient._id} {...ingredient} />
						))}
				</div>
				<div className={styles.ingredients_group}>
					<h2 className='text text_type_main-medium mb-6'>Соусы</h2>
					{ingredients
						.filter((ingredient) => ingredient.type === 'sauce')
						.map((ingredient) => (
							<BurgerIngredient key={ingredient._id} {...ingredient} />
						))}
				</div>
				<div className={styles.ingredients_group}>
					<h2 className='text text_type_main-medium mb-6'>Начинки</h2>
					{ingredients
						.filter((ingredient) => ingredient.type === 'main')
						.map((ingredient) => (
							<BurgerIngredient key={ingredient._id} {...ingredient} />
						))}
				</div>
			</div>
		</section>
	);
};
