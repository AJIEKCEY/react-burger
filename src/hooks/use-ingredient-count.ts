import { useAppSelector } from './redux';
import { selectIngredientCounts } from '@/services/selectors';

export const useIngredientCounts = () => {
	return useAppSelector(selectIngredientCounts);
};

export const useIngredientCount = (ingredientId: string) => {
	return useAppSelector((state) => {
		const counts = selectIngredientCounts(state);
		return counts[ingredientId] || 0;
	});
};
