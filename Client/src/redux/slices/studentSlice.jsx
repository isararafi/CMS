import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginStudent } from '../../api/authApi';

export const studentLogin = createAsyncThunk(
  'student/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginStudent(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    logoutStudent: (state) => {
      state.user = null;
      state.token = null;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(studentLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(studentLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        state.success = true;
      })
      .addCase(studentLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        state.success = false;
      });
  },
});

export const { logoutStudent } = studentSlice.actions;
export default studentSlice.reducer;
