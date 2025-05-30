import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk to fetch teacher profile
export const fetchTeacherProfile = createAsyncThunk(
  'teacherDashboard/fetchTeacherProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request('/teacher/profile', 'GET');
      console.log('fetchTeacherProfile - API response:', response);
      return response;
    } catch (error) {
      console.error('fetchTeacherProfile - Error:', error);
      return rejectWithValue({ message: error.message || 'Failed to fetch teacher profile' });
    }
  }
);

// Async thunk to fetch teacher courses
export const fetchTeacherCourses = createAsyncThunk(
  'teacherDashboard/fetchTeacherCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request('/teacher/courses', 'GET');
      console.log('fetchTeacherCourses - API response:', response);
      return response;
    } catch (error) {
      console.error('fetchTeacherCourses - Error:', error);
      return rejectWithValue({ message: error.message || 'Failed to fetch teacher courses' });
    }
  }
);

const initialState = {
  profile: {
    name: '',
    email: '',
  },
  courses: [],
  isLoading: false,
  error: null,
};

const teacherDashboardSlice = createSlice({
  name: 'teacherDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeacherProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile.name = action.payload.name;
        state.profile.email = action.payload.email;
        state.error = null;
      })
      .addCase(fetchTeacherProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch teacher profile';
      })
      .addCase(fetchTeacherCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeacherCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload;
        state.error = null;
      })
      .addCase(fetchTeacherCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch teacher courses';
      });
  },
});

export default teacherDashboardSlice.reducer; 