import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk to get marks
export const getMarks = createAsyncThunk(
  'teacherDashboard/getMarks',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request(`/teacher/courses/${courseId}/marks`, 'GET');
      console.log('getMarks - API response:', response);
      return response;
    } catch (error) {
      console.error('getMarks - Error:', error);
      return rejectWithValue({ message: error.message || 'Failed to get marks' });
    }
  }
);

const initialState = {
  isLoading: false,
  error: null,
  marks: [],
};

const getMarksSlice = createSlice({
  name: 'getMarks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMarks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMarks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.marks = action.payload;
        state.error = null;
      })
      .addCase(getMarks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to get marks';
      });
  },
});

export default getMarksSlice.reducer; 