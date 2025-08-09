import { useState, useCallback, ChangeEvent } from 'react';

// Типы для значений формы
export interface FormValues {
	[key: string]: string;
}

// Интерфейс возвращаемого значения
export interface UseFormReturn {
	values: FormValues;
	handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
	setValues: (values: FormValues | ((prev: FormValues) => FormValues)) => void;
	resetForm: () => void;
	setFieldValue: (fieldName: string, value: string) => void;
}

export function useForm(inputValues: FormValues = {}): UseFormReturn {
	const [values, setValues] = useState<FormValues>(inputValues);

	// Универсальная функция изменения полей
	const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		const { value, name } = event.target;
		setValues((prev) => ({
			...prev,
			[name]: value,
		}));
	}, []);

	// Установка значения конкретного поля
	const setFieldValue = useCallback((fieldName: string, value: string) => {
		setValues((prev) => ({
			...prev,
			[fieldName]: value,
		}));
	}, []);

	// Полный сброс формы
	const resetForm = useCallback(() => {
		setValues(inputValues);
	}, [inputValues]);

	return {
		values,
		handleChange,
		setValues,
		resetForm,
		setFieldValue,
	};
}
