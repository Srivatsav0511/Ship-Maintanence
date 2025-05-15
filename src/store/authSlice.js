
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const success = await authService.login(email, password);
      if (success) {
        const user = authService.getUser();
        return user;
      } else {
        return rejectWithValue('Invalid email or password');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Safe SSR/browser check
const isBrowser = typeof window !== 'undefined';

const initialState = {
  user: isBrowser ? authService.getUser() : null,
  isAuthenticated: isBrowser ? authService.isAuthenticated() : false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;