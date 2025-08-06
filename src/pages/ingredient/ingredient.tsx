import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './ingredient.module.css';

export const IngredientPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();

	return (
		<div className={styles.container}>
			<h1 className='text text_type_main-large'>Детали ингредиента</h1>
			<p className='text text_type_main-medium'>ID ингредиента: {id}</p>
			<p className='text text_type_main-medium'>Страница ингредиента</p>
		</div>
	);
};
