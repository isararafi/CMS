import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAdmin } from '../../api/authApi';

export const adminLogin = createAsyncThunk(
  'admin/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginAdmin(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    logoutAdmin: (state) => {
      state.user = null;
      state.token = null;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        state.success = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        state.success = false;
      });
  },
});

export const { logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
