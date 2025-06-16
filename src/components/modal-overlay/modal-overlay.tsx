import React from 'react';
import styles from './modal-overlay.module.css';

type TModalOverlayProps = {
	onClick: () => void;
};

export const ModalOverlay = ({
	onClick,
}: TModalOverlayProps): React.JSX.Element => {
	const handleOverlayClick = (e: React.MouseEvent) => {
		// Only close if the overlay itself is clicked, not its children
		if (e.target === e.currentTarget) {
			onClick();
		}
	};

	return <button className={styles.overlay} onClick={handleOverlayClick} />;
};
