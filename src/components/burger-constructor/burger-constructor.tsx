import React, { useMemo, useState, useEffect } from 'react';
import { TIngredient } from '@utils/types.ts';
import styles from './burger-constructor.module.css';
import {
	ConstructorElement,
	CurrencyIcon,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';

type TBurgerConstructorProps = {
	ingredients: TIngredient[];
	onOrderClick?: () => void;
};

export const BurgerConstructor = ({
	ingredients,
	onOrderClick = () => {},
}: TBurgerConstructorProps): React.JSX.Element => {
	const [bun, setBun] = useState<TIngredient | undefined>();
	const [fillings, setFillings] = useState<TIngredient[]>([]);

	useEffect(() => {
		if (ingredients.length > 0) {
			const foundBun = ingredients.find((item) => item.type === 'bun');
			setBun(foundBun);
			const fondFillings = ingredients.filter((item) => item.type !== 'bun');
			setFillings(fondFillings);
		}
	}, [ingredients]);

	// На данном этапе предполагаем что булочки для низа и верха не могут быть разными.
	const totalPrice = useMemo(() => {
		return (
			(bun ? bun.price * 2 : 0) +
			fillings.reduce((sum, item) => sum + item.price, 0)
		);
	}, [bun, fillings]);

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
					{fillings.map((item) => (
						<div className={styles.element} key={item._id}>
							<ConstructorElement
								text={item.name}
								price={item.price}
								thumbnail={item.image}
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
					onClick={onOrderClick}>
					Оформить заказ
				</Button>
			</div>
		</section>
	);
};
