import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './not-found.module.css';

export const NotFoundPage: React.FC = () => {
	return (
		<main className={styles.wrapper}>
			<div className={styles.container}>
				<div className={styles.content}>
					<h1 className={`${styles.title} text text_type_digits-large`}>404</h1>
					<h2 className='text text_type_main-large mb-4'>
						Страница не найдена
					</h2>
					<p className='text text_type_main-default text_color_inactive mb-8'>
						К сожалению, запрашиваемая страница не существует или была
						перемещена
					</p>
					<Link to='/' className={styles.link}>
						<Button type='primary' size='medium'>
							Вернуться на главную
						</Button>
					</Link>
				</div>
				<div className={styles.illustration}>
					<div className={styles.burger404}>
						<div className={styles.bun}></div>
						<div className={styles.ingredient}></div>
						<div className={styles.ingredient}></div>
						<div className={styles.bunBottom}></div>
					</div>
				</div>
			</div>
		</main>
	);
};
