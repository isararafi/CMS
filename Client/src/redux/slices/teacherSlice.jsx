import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginTutor } from '../../api/authApi';

export const tutorLogin = createAsyncThunk(
  'tutor/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginTutor(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const tutorSlice = createSlice({
  name: 'tutor',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    logoutTutor: (state) => {
      state.user = null;
      state.token = null;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(tutorLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(tutorLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        state.success = true;
      })
      .addCase(tutorLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        state.success = false;
      });
  },
});

export const { logoutTutor } = tutorSlice.actions;
export default tutorSlice.reducer;
