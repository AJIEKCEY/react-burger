import React, { useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { DND_TYPES } from '@/constants/dnd';
import { TIngredient } from '@/types/types';
import styles from './burger-constructor.module.css';
import { DraggableConstructorElement } from '@components/draggable-constructor-element/draggable-constructor-element.tsx';
import {
	ConstructorElement,
	CurrencyIcon,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useBurgerConstructor } from '@hooks/use-burger-constructor';

type TBurgerConstructorProps = {
	ingredients?: TIngredient[];
};

export const BurgerConstructor = ({
	ingredients = [] as TIngredient[],
}: TBurgerConstructorProps): React.JSX.Element => {
	const {
		bun,
		fillings,
		totalPrice,
		orderLoading,
		handleSetIngredients,
		handleOrderClick,
		handleRemoveFilling,
		handleAddIngredient,
		handleMoveFilling,
	} = useBurgerConstructor();

	// Drop zone для всего конструктора
	const [{ isOver, canDrop }, dropRef] = useDrop({
		accept: DND_TYPES.INGREDIENT,
		drop: (item: TIngredient) => {
			handleAddIngredient(item);
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	});

	useEffect(() => {
		if (ingredients && ingredients.length > 0) {
			handleSetIngredients(ingredients);
		}
	}, [ingredients, handleSetIngredients]);

	return (
		<section className={`${styles.burger_constructor} pt-25`}>
			<div ref={dropRef} className={isOver && canDrop ? styles.dragOver : ''}>
				<div className={styles.elements}>
					{bun && (
						<div className={styles.element}>
							<ConstructorElement
								type='top'
								isLocked={true}
								text={`${bun.name} (верх)`}
								price={bun.price}
								thumbnail={bun.image}
							/>
						</div>
					)}
					{/* Начинки */}
					<div className={`${styles.fillings} custom-scroll`}>
						{fillings.length > 0 ? (
							fillings.map((item, index) => (
								<DraggableConstructorElement
									key={item.constructorId} // Важно: используем constructorId как key
									index={index}
									ingredient={item}
									onMove={handleMoveFilling}
									onRemove={() => handleRemoveFilling(item.constructorId)}
								/>
							))
						) : (
							<div className={styles.emptyFillings}>
								<div className={styles.placeholder}>
									<span className='text text_type_main-default text_color_inactive'>
										Перетащите ингредиенты сюда
									</span>
								</div>
							</div>
						)}
					</div>

					{bun && (
						<div className={styles.element}>
							<ConstructorElement
								type='bottom'
								isLocked={true}
								text={`${bun.name} (низ)`}
								price={bun.price}
								thumbnail={bun.image}
							/>
						</div>
					)}
				</div>
			</div>
			<div className={`${styles.total} pt-10`}>
				<div className={`${styles.price} mr-10`}>
					<span className='text text_type_digits-medium mr-2'>
						{totalPrice}
					</span>
					<CurrencyIcon type='primary' />
				</div>
				<Button
					htmlType='button'
					type='primary'
					size='large'
					onClick={handleOrderClick}
					disabled={!bun || fillings.length === 0 || orderLoading}>
					{orderLoading ? 'Оформление...' : 'Оформить заказ'}
				</Button>
			</div>
		</section>
	);
};
