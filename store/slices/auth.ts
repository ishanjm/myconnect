import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser, LoginCredentials, RegisterCredentials } from '@/model/auth';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state, action: PayloadAction<LoginCredentials>) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: AuthUser; token: string }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    registerRequest: (state, action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<{ user: AuthUser; token: string }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logoutRequest: (state) => {
      state.isLoading = true;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
    },
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    meRequest: (state) => {
      state.isLoading = true;
    },
    meSuccess: (state, action: PayloadAction<{ user: AuthUser }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.error = null;
    },
    meFailure: (state) => {
      state.isLoading = false;
      // We don't set error here because hydration failure just means user is not logged in
    },
    updateProfileImageRequest: (state, action: PayloadAction<FormData>) => {
      state.isLoading = true;
      state.error = null;
    },
    updateProfileImageSuccess: (state, action: PayloadAction<{ profileImage: string }>) => {
      state.isLoading = false;
      if (state.user) {
        state.user.profileImage = action.payload.profileImage;
      }
      state.error = null;
    },
    updateProfileImageFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { 
  loginRequest, loginSuccess, loginFailure, 
  registerRequest, registerSuccess, registerFailure, 
  logoutRequest, logoutSuccess, logoutFailure,
  meRequest, meSuccess, meFailure,
  updateProfileImageRequest, updateProfileImageSuccess, updateProfileImageFailure
} = authSlice.actions;
export default authSlice.reducer;
