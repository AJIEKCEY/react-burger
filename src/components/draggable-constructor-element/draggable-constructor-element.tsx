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
	extraClass?: string;
	handleClose?: () => void;
};

export const DraggableConstructorElement: React.FC<
	TDraggableConstructorElementProps
> = (props) => {
	return (
		<div className={styles.container}>
			<div className={styles.dragIcon}>
				<DragIcon type='primary' />
			</div>
			<ConstructorElement {...props} />
		</div>
	);
};
