import { createSlice } from '@reduxjs/toolkit';
import { getUser, updateUser } from '../actions/user';

export interface UserProfileState {
	isLoading: boolean;
	error: string | null;
	isUpdating: boolean;
}

const initialState: UserProfileState = {
	isLoading: false,
	error: null,
	isUpdating: false,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		clearUserError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Получение данных пользователя
			.addCase(getUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getUser.fulfilled, (state) => {
				state.isLoading = false;
				state.error = null;
			})
			.addCase(getUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload || 'Ошибка получения данных пользователя';
			})

			// Обновление данных пользователя
			.addCase(updateUser.pending, (state) => {
				state.isUpdating = true;
				state.error = null;
			})
			.addCase(updateUser.fulfilled, (state) => {
				state.isUpdating = false;
				state.error = null;
			})
			.addCase(updateUser.rejected, (state, action) => {
				state.isUpdating = false;
				state.error = action.payload || 'Ошибка обновления данных пользователя';
			});
	},
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
