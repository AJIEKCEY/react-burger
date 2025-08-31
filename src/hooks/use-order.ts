import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@services/store';
import {
	fetchOrderByNumber,
	clearOrder,
} from '@services/slices/single-order-slice';
import { Order } from '@services/slices/feed-slice';

interface UseOrderResult {
	order: Order | null;
	loading: boolean;
	error: string | null;
	fetchOrder: (orderNumber: number) => void;
	clearOrderData: () => void;
}

export const useOrder = (orderNumber?: number): UseOrderResult => {
	const dispatch = useDispatch<AppDispatch>();
	const { order, loading, error } = useSelector(
		(state: RootState) => state.singleOrder
	);

	// Пытаемся найти заказ в ленте заказов если он есть
	const { orders: feedOrders } = useSelector((state: RootState) => state.feed);
	const orderFromFeed = feedOrders.find((o) => o.number === orderNumber);

	// Автоматически загружаем заказ если он нужен и не найден в ленте
	useEffect(() => {
		if (orderNumber && !orderFromFeed && !order && !loading) {
			dispatch(fetchOrderByNumber(orderNumber));
		}
	}, [orderNumber, orderFromFeed, order, loading, dispatch]);

	// Используем заказ из ленты если он доступен, иначе из API
	const effectiveOrder = orderFromFeed || order;

	const fetchOrder = (num: number) => {
		dispatch(fetchOrderByNumber(num));
	};

	const clearOrderData = () => {
		dispatch(clearOrder());
	};

	return {
		order: effectiveOrder,
		loading,
		error,
		fetchOrder,
		clearOrderData,
	};
};
