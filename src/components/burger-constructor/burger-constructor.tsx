import React, { useEffect } from 'react';
import { TIngredient, TConstructorIngredient } from '@/types/types';
import styles from './burger-constructor.module.css';
import { DraggableConstructorElement } from '@components/draggable-constructor-element/draggable-constructor-element.tsx';
import {
	ConstructorElement,
	CurrencyIcon,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useBurgerConstructor } from '@hooks/use-burger-constructor';

type TBurgerConstructorProps = {
	ingredients: TIngredient[];
	onOrderClick?: () => void;
};

export const BurgerConstructor = ({
	ingredients,
	onOrderClick = () => {},
}: TBurgerConstructorProps): React.JSX.Element => {
	const {
		bun,
		fillings,
		totalPrice,
		handleSetIngredients,
		handleOrderClick,
		handleRemoveFilling,
	} = useBurgerConstructor();

	useEffect(() => {
		if (ingredients.length > 0) {
			handleSetIngredients(ingredients);
		}
	}, [ingredients, handleSetIngredients]);

	// // На данном этапе предполагаем что булочки для низа и верха не могут быть разными.
	// const totalPrice = useMemo(() => {
	// 	return (
	// 		(bun ? bun.price * 2 : 0) +
	// 		fillings.reduce((sum, item) => sum + item.price, 0)
	// 	);
	// }, [bun, fillings]);

	// Используем переданный обработчик или внутренний
	const handleOrder = onOrderClick || handleOrderClick;

	return (
		<section className={`${styles.burger_constructor} pt-25`}>
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

				<div className={`${styles.fillings} custom-scroll`}>
					{fillings.map((item: TConstructorIngredient) => (
						<div className={styles.element} key={item.constructorId}>
							<DraggableConstructorElement
								text={item.name}
								price={item.price}
								thumbnail={item.image}
								onRemove={() => handleRemoveFilling(item.constructorId)}
							/>
						</div>
					))}
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
					onClick={handleOrder}
					disabled={!bun || fillings.length === 0}>
					Оформить заказ
				</Button>
			</div>
		</section>
	);
};
