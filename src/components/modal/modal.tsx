import React, { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './modal.module.css';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

type TModalProps = {
	children: ReactNode;
	title?: string;
	onClose: () => void;
};

export const Modal = ({
	children,
	title,
	onClose,
}: TModalProps): React.JSX.Element | null => {
	const modalRoot = document.getElementById('modal-root');

	// Close modal on Escape key press
	useEffect(() => {
		const handleEscClose = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', handleEscClose);

		return () => {
			document.removeEventListener('keydown', handleEscClose);
		};
	}, [onClose]);

	// Prevent scrolling of the body when modal is open
	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, []);

	if (!modalRoot) {
		console.error('Modal root element not found');
		return null;
	}

	return createPortal(
		<>
			<ModalOverlay onClick={onClose} />
			<div className={styles.modal} data-testid='modal'>
				<div className={styles.header}>
					<h2 className={`${styles.title} text text_type_main-large`}>
						{title && title.length > 0 ? title : ''}
					</h2>
					<button
						type='button'
						className={styles.closeButton}
						aria-label='Закрыть'
						data-testid='modal-close-button'
						onClick={onClose}>
						<CloseIcon type='primary' />
					</button>
				</div>
				<div className={styles.content}>{children}</div>
			</div>
		</>,
		modalRoot
	);
};
