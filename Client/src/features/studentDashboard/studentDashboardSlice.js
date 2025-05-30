import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiHandler from '../../services/apiHandler';

// Async thunk for fetching dashboard info
export const fetchDashboardInfo = createAsyncThunk(
  'studentDashboard/fetchDashboardInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiHandler.get('/student/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching GPA progress
export const fetchGpaProgress = createAsyncThunk(
  'studentDashboard/fetchGpaProgress',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiHandler.get('/student/gpa-progress');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  dashboardInfo: {
    name: "",
    rollNo: "",
    semester: 0,
    cgpa: 0,
    enrolledCourses: [],
    attendanceRate: 0,
    totalCredits: 0
  },
  gpaProgress: [],
  isLoading: false,
  error: null
};

const studentDashboardSlice = createSlice({
  name: 'studentDashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Dashboard Info
    builder
      .addCase(fetchDashboardInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardInfo = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch dashboard info';
      })
      // GPA Progress
      .addCase(fetchGpaProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGpaProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gpaProgress = action.payload;
        state.error = null;
      })
      .addCase(fetchGpaProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch GPA progress';
      });
  },
});

export const { clearError } = studentDashboardSlice.actions;
export default studentDashboardSlice.reducer; 