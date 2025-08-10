import React from 'react';

import styles from './loader.module.css';

interface LoaderProps {
	text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ text = 'Загрузка...' }) => {
	return (
		<div className={styles.preloader}>
			<div className={styles.preloader_circle} />
			<p className='text text_type_main-medium'>{text}</p>
		</div>
	);
};
