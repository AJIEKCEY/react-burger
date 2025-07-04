import { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useThrottle } from '@hooks/useThrottle.ts';
import {
	setActiveTab,
	setActiveTabFromScroll,
} from '@services/reducers/burger-ingredients';
import { IInitialState, TIngredientCategory } from '@/types/types';

export const useBurgerIngredients = () => {
	const dispatch = useDispatch();
	const { activeTab } = useSelector(
		(state: IInitialState) => state.burgerIngredients
	);

	// Рефы для секций ингредиентов
	const bunRef = useRef<HTMLDivElement>(null);
	const sauceRef = useRef<HTMLDivElement>(null);
	const mainRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// Состояние для отслеживания программной прокрутки
	const [isUserScrolling, setIsUserScrolling] = useState(true);

	// Словарь рефов для удобного доступа
	const sectionRefs = {
		bun: bunRef,
		sauce: sauceRef,
		main: mainRef,
	};

	// Улучшенный обработчик прокрутки
	const handleScrollLogic = useCallback(() => {
		if (!isUserScrolling || !containerRef.current) return;

		const container = containerRef.current;
		const containerRect = container.getBoundingClientRect();
		const containerTop = containerRect.top;

		const sections = [
			{ name: 'bun' as TIngredientCategory, ref: bunRef },
			{ name: 'sauce' as TIngredientCategory, ref: sauceRef },
			{ name: 'main' as TIngredientCategory, ref: mainRef },
		];

		let currentSection = 'bun' as TIngredientCategory;
		let minDistance = Infinity;

		// Находим заголовок, который ближе всего к верху контейнера
		for (const section of sections) {
			if (section.ref.current) {
				const sectionRect = section.ref.current.getBoundingClientRect();
				const sectionTop = sectionRect.top;
				const sectionBottom = sectionRect.bottom;

				// Проверяем, что секция хотя бы частично видна
				const isVisible =
					sectionBottom > containerTop && sectionTop < containerRect.bottom;

				if (isVisible) {
					// Вычисляем расстояние от верха секции до верха контейнера
					const distanceToTop = sectionTop - containerTop;
					if (distanceToTop < minDistance) {
						minDistance = distanceToTop;
						currentSection = section.name;
					}
				}
			}
		}

		// Обновляем активный таб только если он изменился
		if (currentSection !== activeTab) {
			dispatch(setActiveTabFromScroll(currentSection));
		}
	}, [activeTab, dispatch, isUserScrolling]);

	const handleScroll = useThrottle(handleScrollLogic, 100);

	// Обработчик клика по табу
	const handleTabClick = useCallback(
		(tab: TIngredientCategory) => {
			setIsUserScrolling(false);
			dispatch(setActiveTab(tab));

			// Прокручиваем к соответствующей секции
			const targetRef = sectionRefs[tab];
			if (targetRef.current && containerRef.current) {
				const container = containerRef.current;
				const target = targetRef.current;

				// Прокручиваем так, чтобы заголовок секции был у верха контейнера
				const scrollOffset = target.offsetTop - container.offsetTop;

				container.scrollTo({
					top: scrollOffset,
					behavior: 'smooth',
				});
			}

			// Возвращаем возможность отслеживания прокрутки пользователем
			// Увеличиваем время ожидания для гарантии завершения анимации
			setTimeout(() => setIsUserScrolling(true), 800);
		},
		[dispatch]
	);

	return {
		activeTab,
		handleTabClick,
		handleScroll,
		containerRef,
		sectionRefs: {
			bunRef,
			sauceRef,
			mainRef,
		},
	};
};
