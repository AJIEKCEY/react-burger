import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DND_TYPES } from '@/constants/dnd';
import { TConstructorIngredient } from '@/types/types';
import {
	ConstructorElement,
	DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './draggable-constructor-element.module.css';

type TDragItem = {
	index: number;
	id: string;
	type: string;
};

type TDraggableConstructorElementProps = {
	ingredient: TConstructorIngredient;
	index: number;
	onMove: (dragIndex: number, hoverIndex: number) => void;
	onRemove: () => void;
};

// Типизируем возвращаемое значение от collect для useDrop
interface TDropCollectedProps {
	handlerId: string | symbol | null;
}

// Типизируем возвращаемое значение от collect для useDrag
interface TDragCollectedProps {
	isDragging: boolean;
}

export const DraggableConstructorElement = ({
	ingredient,
	index,
	onMove,
	onRemove,
}: TDraggableConstructorElementProps): React.JSX.Element => {
	const ref = useRef<HTMLDivElement>(null);

	const [{ handlerId }, drop] = useDrop<TDragItem, void, TDropCollectedProps>({
		accept: DND_TYPES.CONSTRUCTOR_INGREDIENT,
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId(),
			};
		},
		hover(item: TDragItem, monitor) {
			if (!ref.current) {
				return;
			}

			const dragIndex = item.index;
			const hoverIndex = index;

			// Не заменяем элемент самим собой
			if (dragIndex === hoverIndex) {
				return;
			}

			// Определяем границы прямоугольника на экране
			const hoverBoundingRect = ref.current?.getBoundingClientRect();

			// Получаем вертикальную середину
			const hoverMiddleY =
				(hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

			// Определяем позицию мыши
			const clientOffset = monitor.getClientOffset();

			// Получаем пиксели до верха
			const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

			// Перетаскиваем, только когда мышь пересекла половину высоты элемента

			// Перетаскиваем вниз
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}

			// Перетаскиваем вверх
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}

			// Время для перемещения элемента
			onMove(dragIndex, hoverIndex);

			// Обновляем индекс для перетаскиваемого элемента
			item.index = hoverIndex;
		},
	});

	const [{ isDragging }, drag] = useDrag<TDragItem, void, TDragCollectedProps>({
		type: DND_TYPES.CONSTRUCTOR_INGREDIENT,
		item: () => {
			return {
				id: ingredient.constructorId,
				index,
				type: DND_TYPES.CONSTRUCTOR_INGREDIENT,
			};
		},
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	const opacity = isDragging ? 0 : 1;
	drag(drop(ref));

	return (
		<div
			ref={ref}
			className={`${styles.container} ${isDragging ? styles.dragging : ''}`}
			style={{ opacity }}
			data-handler-id={handlerId}>
			<div className={styles.dragIcon}>
				<DragIcon type='primary' />
			</div>
			<ConstructorElement
				text={ingredient.name}
				price={ingredient.price}
				thumbnail={ingredient.image}
				handleClose={onRemove} // Передаем функцию удаления
			/>
		</div>
	);
};
