import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk to fetch course marks
export const fetchCourseMarks = createAsyncThunk(
  'courses/fetchCourseMarks',
  async (courseId, { rejectWithValue }) => {
    try {
      const data = await ApiHandler.request(`/student/courses/${courseId}/marks`, 'GET');
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to fetch course marks' });
    }
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    marks: {
      sessional: [],
      midterm: [],
      final: []
    },
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
        // Group marks by type
        const groupedMarks = action.payload.reduce((acc, mark) => {
          if (!acc[mark.type]) {
            acc[mark.type] = [];
          }
          acc[mark.type].push(mark);
          return acc;
        }, {
          sessional: [],
          midterm: [],
          final: []
        });
        state.marks = groupedMarks;
      })
      .addCase(fetchCourseMarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch course marks';
      });
  },
});

export default coursesSlice.reducer; 