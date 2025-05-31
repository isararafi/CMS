import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk to fetch course marks
export const fetchCourseMarks = createAsyncThunk(
  'courses/fetchCourseMarks',
  async (studentId, { rejectWithValue }) => {
    try {
      const data = await ApiHandler.request(`/student/courses/${studentId}/marks`, 'GET');
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to fetch course marks' });
    }
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    marks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseMarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseMarks.fulfilled, (state, action) => {
        state.loading = false;
        state.marks = action.payload;
      })
      .addCase(fetchCourseMarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch course marks';
      });
  },
});

export default coursesSlice.reducer; 