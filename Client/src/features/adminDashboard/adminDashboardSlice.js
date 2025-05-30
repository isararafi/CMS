import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk to fetch all students
export const fetchAllStudents = createAsyncThunk(
  'adminDashboard/fetchAllStudents',
  async (_, { rejectWithValue }) => {
    try {
      const data = await ApiHandler.request('/admin/students', 'GET');
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to fetch students' });
    }
  }
);

// Async thunk to fetch all teachers
export const fetchAllTeachers = createAsyncThunk(
  'adminDashboard/fetchAllTeachers',
  async (_, { rejectWithValue }) => {
    try {
      const data = await ApiHandler.request('/admin/teachers', 'GET');
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to fetch teachers' });
    }
  }
);

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState: {
    students: [],
    teachers: [],
    loadingStudents: false,
    loadingTeachers: false,
    errorStudents: null,
    errorTeachers: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Students
      .addCase(fetchAllStudents.pending, (state) => {
        state.loadingStudents = true;
        state.errorStudents = null;
      })
      .addCase(fetchAllStudents.fulfilled, (state, action) => {
        state.loadingStudents = false;
        state.students = action.payload;
      })
      .addCase(fetchAllStudents.rejected, (state, action) => {
        state.loadingStudents = false;
        state.errorStudents = action.payload?.message || 'Failed to fetch students';
      })
      // Teachers
      .addCase(fetchAllTeachers.pending, (state) => {
        state.loadingTeachers = true;
        state.errorTeachers = null;
      })
      .addCase(fetchAllTeachers.fulfilled, (state, action) => {
        state.loadingTeachers = false;
        state.teachers = action.payload;
      })
      .addCase(fetchAllTeachers.rejected, (state, action) => {
        state.loadingTeachers = false;
        state.errorTeachers = action.payload?.message || 'Failed to fetch teachers';
      });
  },
});

export default adminDashboardSlice.reducer; 