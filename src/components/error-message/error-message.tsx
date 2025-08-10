import React from 'react';

interface ErrorMessageProps {
	error: string | null;
	className?: string;
	type?: 'error' | 'warning' | 'info';
	showRetry?: boolean;
	onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
	error,
	className = 'mb-4',
	type = 'error',
	showRetry = false,
	onRetry,
}) => {
	if (!error) return null;

	const getColor = () => {
		switch (type) {
			case 'error':
				return 'red';
			case 'warning':
				return 'orange';
			case 'info':
				return 'blue';
			default:
				return 'red';
		}
	};

	return (
		<div className={className}>
			<div
				className='text text_type_main-default'
				style={{ color: getColor() }}>
				{error}
			</div>
			{showRetry && onRetry && (
				<button
					onClick={onRetry}
					className='text text_type_main-small mt-2'
					style={{
						background: 'none',
						border: 'none',
						color: '#4C4CFF',
						cursor: 'pointer',
						textDecoration: 'underline',
					}}>
					Попробовать снова
				</button>
			)}
		</div>
	);
};
