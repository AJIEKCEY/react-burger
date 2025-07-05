import React, { useRef } from 'react';
import styles from './burger-ingredient.module.css';
import { TIngredient } from '@/types/types';
import { useDrag } from 'react-dnd';
import { DND_TYPES } from '@/constants/dnd';
import { useIngredientCount } from '@hooks/use-ingredient-count';
import {
	Counter,
	CurrencyIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';

type TBurgerIngredientProps = {
	ingredient: TIngredient;
	//count?: number;
	onIngredientClick?: (ingredient: TIngredient) => void;
};

// Типизируем возвращаемое значение от collect для useDrag
interface TDragCollectedProps {
	isDragging: boolean;
}

export const BurgerIngredient = ({
	ingredient,
	onIngredientClick,
}: TBurgerIngredientProps): React.JSX.Element => {
	const count = useIngredientCount(ingredient._id);
	const dragStartedRef = useRef(false);

	const [{ isDragging }, dragRef] = useDrag<
		TIngredient,
		void,
		TDragCollectedProps
	>({
		type: DND_TYPES.INGREDIENT,
		item: ingredient,
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
		// begin: () => {
		// 	// Отмечаем начало перетаскивания
		// 	dragStartedRef.current = true;
		// },
		end: () => {
			// Сбрасываем флаг после завершения перетаскивания
			setTimeout(() => {
				dragStartedRef.current = false;
			}, 100); // Небольшая задержка для предотвращения срабатывания onClick
		},
	});

	const handleMouseUp = () => {
		// Открываем модальное окно только если не было перетаскивания
		if (!dragStartedRef.current && !isDragging) {
			console.log('Opening modal for:', ingredient.name); // Отладка
			onIngredientClick?.(ingredient);
		}
	};

	return (
		<article
			ref={dragRef}
			className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
			onMouseUp={handleMouseUp}>
			<img
				src={ingredient.image}
				alt={ingredient.name}
				className={styles.image}
			/>
			<div className={styles.price}>
				<span className='text text_type_digits-default mr-2'>
					{ingredient.price}
				</span>
				<CurrencyIcon type='primary' />
			</div>
			<p className={`${styles.name} text text_type_main-default`}>
				{ingredient.name}
			</p>
			{count > 0 && <Counter count={count} size='default' />}
		</article>
	);
};
