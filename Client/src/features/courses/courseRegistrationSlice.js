import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk to fetch available courses
export const fetchAvailableCourses = createAsyncThunk(
  'courseRegistration/fetchAvailableCourses',
  async (_, { rejectWithValue }) => {
    try {
      const data = await ApiHandler.request('/student/courses/available', 'GET');
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to fetch available courses' });
    }
  }
);

// Async thunk to register courses
export const registerCourses = createAsyncThunk(
  'courseRegistration/registerCourses',
  async (courseIds, { rejectWithValue }) => {
    try {
      const data = await ApiHandler.request('/student/courses/register', 'POST', { courseIds });
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to register courses' });
    }
  }
);

const initialState = {
  availableCourses: [],
  selectedCourses: [],
  loading: false,
  registrationLoading: false,
  error: null,
  registrationError: null,
  registrationSuccess: false,
  successMessage: ''
};

const courseRegistrationSlice = createSlice({
  name: 'courseRegistration',
  initialState,
  reducers: {
    toggleCourseSelection: (state, action) => {
      const courseId = action.payload;
      if (state.selectedCourses.includes(courseId)) {
        state.selectedCourses = state.selectedCourses.filter(id => id !== courseId);
      } else {
        state.selectedCourses.push(courseId);
      }
    },
    clearRegistrationStatus: (state) => {
      state.registrationSuccess = false;
      state.registrationError = null;
      state.successMessage = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch available courses cases
      .addCase(fetchAvailableCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.availableCourses = action.payload;
      })
      .addCase(fetchAvailableCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch available courses';
      })
      // Register courses cases
      .addCase(registerCourses.pending, (state) => {
        state.registrationLoading = true;
        state.registrationError = null;
      })
      .addCase(registerCourses.fulfilled, (state, action) => {
        state.registrationLoading = false;
        state.registrationSuccess = true;
        state.successMessage = action.payload.message;
        state.selectedCourses = [];
      })
      .addCase(registerCourses.rejected, (state, action) => {
        state.registrationLoading = false;
        state.registrationError = action.payload?.message || 'Failed to register courses';
      });
  },
});

export const { toggleCourseSelection, clearRegistrationStatus } = courseRegistrationSlice.actions;
export default courseRegistrationSlice.reducer; 