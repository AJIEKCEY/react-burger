import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { OrderCard } from '@/components/order-card/order-card';
import { FeedStats } from '@/components/feed-stats/feed-stats';
import { Loader } from '@/components/loader/loader';
import { ErrorMessage } from '@/components/error-message/error-message';
import { RootState } from '@/services/store';
import { connectFeed, disconnectFeed } from '@/services/slices/feed-slice';
import styles from './feed.module.css';

export const FeedPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const { orders, loading, error, connected } = useAppSelector(
		(state: RootState) => state.feed
	);

	// Используем ref для отслеживания состояния монтирования
	const isMounted = useRef(true);
	const connectionInitiated = useRef(false);

	useEffect(() => {
		isMounted.current = true;

		// Подключаемся к WebSocket только один раз
		if (!connectionInitiated.current && !connected) {
			connectionInitiated.current = true;
			dispatch(connectFeed());
		}

		// Отключаемся при размонтировании компонента
		return () => {
			isMounted.current = false;
			connectionInitiated.current = false;
			dispatch(disconnectFeed());
		};
	}, [dispatch]); // Убираем dependencies которые могут вызывать перерендер

	// Отдельный эффект для переподключения при ошибках
	useEffect(() => {
		if (error && isMounted.current && !connected && !loading) {
			const timer = setTimeout(() => {
				if (isMounted.current) {
					dispatch(connectFeed());
				}
			}, 5000); // Переподключение через 5 секунд

			return () => clearTimeout(timer);
		}
	}, [error, connected, loading, dispatch]);

	// Показываем лоадер только если загружаются ингредиенты И нет заказов
	const shouldShowLoader = loading && orders.length === 0;

	// Показываем ошибку только если нет заказов для отображения и нет загрузки
	const shouldShowError = error && orders.length === 0 && !loading;

	if (shouldShowLoader) {
		return (
			<div className={styles.container}>
				<h1 className='text text_type_main-large mb-5'>Лента заказов</h1>
				<Loader />
			</div>
		);
	}

	if (shouldShowError) {
		return (
			<div className={styles.container}>
				<h1 className='text text_type_main-large mb-5'>Лента заказов</h1>
				<ErrorMessage error={error} />
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<h1 className='text text_type_main-large mb-5'>Лента заказов</h1>

			{/* Показываем индикатор состояния подключения */}
			{(!connected || loading) && orders.length > 0 && (
				<div className={styles.reconnecting}>
					<span className='text text_type_main-default text_color_inactive'>
						{loading ? 'Подключение...' : 'Переподключение...'}
					</span>
				</div>
			)}

			<div className={styles.content}>
				<section className={styles.ordersSection}>
					{orders.length > 0 ? (
						<div className={styles.ordersList}>
							{orders.map((order) => (
								<OrderCard key={order._id} order={order} />
							))}
						</div>
					) : (
						<div className={styles.emptyState}>
							<span className='text text_type_main-default text_color_inactive'>
								{loading ? 'Загрузка заказов...' : 'Нет заказов'}
							</span>
						</div>
					)}
				</section>

				<aside className={styles.statsSection}>
					<FeedStats />
				</aside>
			</div>
		</div>
	);
};
