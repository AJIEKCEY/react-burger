import { JSX } from 'react';
import styles from './order-details.module.css';
import doneIcon from '../../images/done.svg';

type TOrderDetailsProps = {
	orderNumber: number;
};

export const OrderDetails = ({
	orderNumber,
}: TOrderDetailsProps): JSX.Element => {
	return (
		<div className={styles.container} data-testid='order-details'>
			<p className='text text_type_digits-large mb-8'>{orderNumber}</p>
			<p className='text text_type_main-medium mb-15'>идентификатор заказа</p>
			<div className={styles.iconWrapper}>
				<img src={doneIcon} alt='Заказ принят' className={styles.icon} />
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
