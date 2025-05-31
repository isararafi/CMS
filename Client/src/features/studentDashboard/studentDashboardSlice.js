import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk for fetching dashboard info
export const fetchDashboardInfo = createAsyncThunk(
  'studentDashboard/fetchDashboardInfo',
  async (_, { rejectWithValue }) => {
    try {
      const data = await ApiHandler.request('/student/dashboard', 'GET');
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to fetch dashboard info' });
    }
  }
);

// Async thunk for fetching GPA progress
export const fetchGpaProgress = createAsyncThunk(
  'studentDashboard/fetchGpaProgress',
  async (_, { rejectWithValue }) => {
    try {
      const data = await ApiHandler.request('/student/gpa-progress', 'GET');
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to fetch GPA progress' });
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