import React from 'react';
import { Modal } from '@components/modal/modal.tsx';
import { Loader } from '@components/loader/loader.tsx';

interface BaseModalWrapperProps {
	title: string;
	onClose: () => void;
	loading?: boolean;
	error?: string;
	children?: React.ReactNode;
}

export const BaseModalWrapper: React.FC<BaseModalWrapperProps> = ({
	title,
	onClose,
	loading,
	error,
	children,
}) => {
	if (loading) {
		return (
			<Modal title='Загрузка...' onClose={onClose}>
				<div style={{ padding: '40px', textAlign: 'center' }}>
					<Loader />
				</div>
			</Modal>
		);
	}

	if (error) {
		return (
			<Modal title='Ошибка' onClose={onClose}>
				<div style={{ padding: '40px', textAlign: 'center' }}>
					<p className='text text_type_main-default text_color_inactive'>
						{error}
					</p>
				</div>
			</Modal>
		);
	}

	return (
		<Modal title={title} onClose={onClose}>
			{children}
		</Modal>
	);
};
