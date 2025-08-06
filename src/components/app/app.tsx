import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
	HomePage,
	LoginPage,
	RegisterPage,
	ForgotPasswordPage,
	ResetPasswordPage,
	ProfilePage,
	IngredientPage,
	NotFoundPage,
} from '@/pages';
import { AppHeader } from '@components/app-header/app-header';
import styles from './app.module.css';
import '@/styles/global.css';

export const App = (): React.JSX.Element => {
	return (
		<Router>
			<div className={styles.app}>
				<AppHeader />
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/login' element={<LoginPage />} />
					<Route path='/register' element={<RegisterPage />} />
					<Route path='/forgot-password' element={<ForgotPasswordPage />} />
					<Route path='/reset-password' element={<ResetPasswordPage />} />
					<Route path='/profile' element={<ProfilePage />} />
					<Route path='/ingredients/:id' element={<IngredientPage />} />
					{/* Catch-all route для 404 */}
					<Route path='*' element={<NotFoundPage />} />
				</Routes>
			</div>
		</Router>
	);
};
