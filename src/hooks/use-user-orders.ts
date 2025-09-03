import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@services/store';
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
	const dispatch = useDispatch<AppDispatch>();

	const { orders, total, totalToday, loading, error, connected } = useSelector(
		(state: RootState) => state.userOrders
	);

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
