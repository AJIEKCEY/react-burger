import { JSX } from 'react';
import styles from './order-details.module.css';
import { CheckMarkIcon } from '@ya.praktikum/react-developer-burger-ui-components';

interface IOrderDetailsProps {
	orderNumber: number;
	orderName: string;
}

export const OrderDetails = ({
	orderNumber,
	orderName,
}: IOrderDetailsProps): JSX.Element => {
	return (
		<div className={styles.container} data-testid='order-details'>
			<p className='text text_type_digits-large mb-8'>{orderNumber}</p>
			<p className='text text_type_main-medium mb-15'>{orderName}</p>
			<div className={styles.icon}>
				<CheckMarkIcon type='primary' />
			</div>

			<p className='text text_type_main-default mt-15 mb-2'>
				Ваш заказ начали готовить
			</p>
			<p className='text text_type_main-default text_color_inactive'>
				Дождитесь готовности на орбитальной станции
			</p>
		</div>
	);
};
