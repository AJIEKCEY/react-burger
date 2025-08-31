import React from 'react';
import { useSelector } from 'react-redux';
import styles from './feed-stats.module.css';
import { RootState } from '@/services/store';

export const FeedStats: React.FC = () => {
	const { orders, total, totalToday } = useSelector(
		(state: RootState) => state.feed
	);

	const doneOrders = orders
		.filter((order) => order.status === 'done')
		.slice(0, 10);
	const pendingOrders = orders
		.filter((order) => order.status === 'pending')
		.slice(0, 10);

	const splitOrdersIntoColumns = (
		ordersList: typeof orders,
		columnsCount: number = 2
	) => {
		const itemsPerColumn = Math.ceil(ordersList.length / columnsCount);
		const columns = [];

		for (let i = 0; i < columnsCount; i++) {
			const start = i * itemsPerColumn;
			const end = start + itemsPerColumn;
			columns.push(ordersList.slice(start, end));
		}

		return columns;
	};

	const doneOrdersColumns = splitOrdersIntoColumns(doneOrders);
	const pendingOrdersColumns = splitOrdersIntoColumns(pendingOrders);

	return (
		<div className={styles.container}>
			<div className={styles.ordersStatus}>
				<div className={styles.statusColumn}>
					<h3 className='text text_type_main-medium mb-6'>Готовы:</h3>
					<div className={styles.columnsContainer}>
						{doneOrdersColumns.map((column, columnIndex) => (
							<div key={columnIndex} className={styles.numberColumn}>
								{column.map((order) => (
									<span
										key={order._id}
										className={`${styles.orderNumber} ${styles.done} text text_type_digits-default`}>
										{order.number}
									</span>
								))}
							</div>
						))}
					</div>
				</div>

				<div className={styles.statusColumn}>
					<h3 className='text text_type_main-medium mb-6'>В работе:</h3>
					<div className={styles.columnsContainer}>
						{pendingOrdersColumns.map((column, columnIndex) => (
							<div key={columnIndex} className={styles.numberColumn}>
								{column.map((order) => (
									<span
										key={order._id}
										className={`${styles.orderNumber} text text_type_digits-default`}>
										{order.number}
									</span>
								))}
							</div>
						))}
					</div>
				</div>
			</div>

			<div className={styles.totalStats}>
				<div className={styles.statItem}>
					<h3 className='text text_type_main-medium'>
						Выполнено за все время:
					</h3>
					<p className={`${styles.totalNumber} text text_type_digits-large`}>
						{total?.toLocaleString()}
					</p>
				</div>

				<div className={styles.statItem}>
					<h3 className='text text_type_main-medium'>Выполнено за сегодня:</h3>
					<p className={`${styles.totalNumber} text text_type_digits-large`}>
						{totalToday?.toLocaleString()}
					</p>
				</div>
			</div>
		</div>
	);
};
