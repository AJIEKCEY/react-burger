import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import { TIngredientCategory } from '@/types/types';
import styles from './burger-ingredients-tabs.module.css';

interface IBurgerIngredientTabsProps {
	activeTab: TIngredientCategory;
	onTabClick: (tab: TIngredientCategory) => void;
}

export const BurgerIngredientTabs: React.FC<IBurgerIngredientTabsProps> = ({
	activeTab,
	onTabClick,
}) => {
	const tabs = [
		{ key: 'bun' as TIngredientCategory, label: 'Булки' },
		{ key: 'sauce' as TIngredientCategory, label: 'Соусы' },
		{ key: 'main' as TIngredientCategory, label: 'Начинки' },
	];

	return (
		<ul className={styles.menu}>
			{tabs.map((tab) => (
				<Tab
					key={tab.key}
					value={tab.key}
					active={activeTab === tab.key}
					onClick={() => onTabClick(tab.key)}>
					{tab.label}
				</Tab>
			))}
		</ul>
	);
};
