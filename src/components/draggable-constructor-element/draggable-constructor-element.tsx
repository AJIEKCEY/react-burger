import React from 'react';
import {
	ConstructorElement,
	DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './draggable-constructor-element.module.css';

type TDraggableConstructorElementProps = {
	text: string;
	thumbnail: string;
	price: number;
	type?: 'top' | 'bottom';
	isLocked?: boolean;
	onRemove?: () => void;
};

export const DraggableConstructorElement = ({
	text,
	price,
	thumbnail,
	onRemove,
}: TDraggableConstructorElementProps): React.JSX.Element => {
	return (
		<div className={styles.container}>
			<div className={styles.dragIcon}>
				<DragIcon type='primary' />
			</div>
			<ConstructorElement
				text={text}
				price={price}
				thumbnail={thumbnail}
				handleClose={onRemove} // Передаем функцию удаления
			/>
		</div>
	);
};
