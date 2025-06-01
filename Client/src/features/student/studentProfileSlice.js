import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

export const fetchStudentProfile = createAsyncThunk(
  'studentProfile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const data = await ApiHandler.request('/student/profile', 'GET');
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to fetch student profile' });
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  error: null
};

const studentProfileSlice = createSlice({
  name: 'studentProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch profile';
      });
  },
});

export default studentProfileSlice.reducer; 