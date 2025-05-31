import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk to add marks
export const addMarks = createAsyncThunk(
  'teacherDashboard/addMarks',
  async (marksData, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request('/teacher/marks', 'POST', marksData);
      console.log('addMarks - API response:', response);
      return response;
    } catch (error) {
      console.error('addMarks - Error:', error);
      return rejectWithValue({ message: error.message || 'Failed to add marks' });
    }
  }
);

const initialState = {
  isLoading: false,
  error: null,
  message: '',
};

const addMarksSlice = createSlice({
  name: 'addMarks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addMarks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addMarks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(addMarks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to add marks';
      });
  },
});

export default addMarksSlice.reducer; 