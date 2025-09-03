import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@services/store';
import {
	connectUserOrders,
	disconnectUserOrders,
} from '@services/slices/user-orders-slice';
import { Order } from '@services/slices/feed-slice.ts';

interface UseUserOrdersResult {
	orders: Order[];
	total: number;
	totalToday: number;
	loading: boolean;
	error: string | null;
	connected: boolean;
}

export const useUserOrders = (): UseUserOrdersResult => {
	const dispatch = useAppDispatch();

	const {
		orders: rawOrders,
		total,
		totalToday,
		loading,
		error,
		connected,
	} = useAppSelector((state: RootState) => state.userOrders);

	// Сортируем заказы по дате (новые сверху)
	const orders = useMemo(() => {
		return [...rawOrders].sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);
	}, [rawOrders]);

	const connect = () => {
		dispatch(connectUserOrders());
	};

	const disconnect = () => {
		dispatch(disconnectUserOrders());
	};

	// Автоматическое подключение при монтировании и отключение при размонтировании
	useEffect(() => {
		connect();

		return () => {
			disconnect();
		};
	}, []);

	return {
		orders,
		total,
		totalToday,
		loading,
		error,
		connected,
	};
};
