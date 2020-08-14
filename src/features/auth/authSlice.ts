import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import usersService from '../../services/users';
import { LoginData, User } from '../../services/users';
import { RootState } from '../../app/rootReducer';

interface Status {
  error: string | null;
  status: 'idle' | 'pending';
}

type AuthState = {
  currentUser: User | null;
} & Status;

export const initialState: AuthState = {
  currentUser: null,
  error: null,
  status: 'idle',
};

export const login = createAsyncThunk(
  'auth/login',
  async (loginData: LoginData) => {
    const response = await usersService.login(loginData);
    localStorage.setItem('accessToken', response.accessToken);
    return response;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.status = 'idle';
      state.currentUser = payload.user;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, { error }) => {
      state.status = 'idle';
      if (error.message) {
        state.error = error.message;
      }
    });
  },
});

export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectError = (state: RootState) => state.auth.error;
export const selectStatus = (state: RootState) => state.auth.status;

export default authSlice.reducer;
