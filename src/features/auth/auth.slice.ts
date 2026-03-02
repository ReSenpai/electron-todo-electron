import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, register, getMe } from './auth.api';
import { tokenStorage } from '../../app/tokenStorage';

interface AuthState {
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const token = await login(email, password);
    await tokenStorage.setToken(token);
    return token;
  },
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async ({ email, password }: { email: string; password: string }) => {
    const token = await register(email, password);
    await tokenStorage.setToken(token);
    return token;
  },
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await tokenStorage.removeToken();
});

export const restoreSessionThunk = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    const token = await tokenStorage.getToken();
    
    if (!token) return null;

    try {
      await getMe();
      return token;
    } catch {
      await tokenStorage.removeToken();
      return rejectWithValue('session_expired');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // login
    builder.addCase(loginThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.token = action.payload;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? 'Login failed';
    });

    // register
    builder.addCase(registerThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.token = action.payload;
    });
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? 'Registration failed';
    });

    // logout
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.token = null;
      state.error = null;
      state.isLoading = false;
    });

    // restoreSession
    builder.addCase(restoreSessionThunk.pending, (state) => {
      state.isInitialized = false;
    });
    builder.addCase(restoreSessionThunk.fulfilled, (state, action) => {
      state.token = action.payload;
      state.isInitialized = true;
    });
    builder.addCase(restoreSessionThunk.rejected, (state) => {
      state.token = null;
      state.isInitialized = true;
    });
  },
});

export default authSlice.reducer;
