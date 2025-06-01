import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk to fetch all course marks
export const fetchAllCourseMarks = createAsyncThunk(
  'courseMarks/fetchAllCourseMarks',
  async (_, { rejectWithValue }) => {
    try {
      const data = await ApiHandler.request('/student/courses/marks', 'GET');
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to fetch course marks' });
    }
  }
);

const initialState = {
  allMarks: [],
  filteredMarks: [],
  loading: false,
  error: null,
  activeType: 'midterm' // default type
};

const courseMarksSlice = createSlice({
  name: 'courseMarks',
  initialState,
  reducers: {
    setActiveType: (state, action) => {
      state.activeType = action.payload;
      // Filter marks based on type
      state.filteredMarks = state.allMarks.map(course => ({
        ...course,
        currentMarks: course.marks.find(mark => mark.type === action.payload) || null
      })).filter(course => course.currentMarks !== null);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCourseMarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourseMarks.fulfilled, (state, action) => {
        state.loading = false;
        state.allMarks = action.payload;
        // Filter marks based on current active type
        state.filteredMarks = action.payload.map(course => ({
          ...course,
          currentMarks: course.marks.find(mark => mark.type === state.activeType) || null
        })).filter(course => course.currentMarks !== null);
      })
      .addCase(fetchAllCourseMarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch course marks';
      });
  },
});

export const { setActiveType } = courseMarksSlice.actions;
export default courseMarksSlice.reducer; 