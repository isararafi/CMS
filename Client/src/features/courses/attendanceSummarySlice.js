import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk to fetch attendance summary
export const fetchAttendanceSummary = createAsyncThunk(
  'attendanceSummary/fetchAttendanceSummary',
  async (studentId, { rejectWithValue }) => {
    try {
      const data = await ApiHandler.request(`/student/courses/${studentId}/attendance/summary`, 'GET');
      return data;
    } catch (error) {
      return rejectWithValue(error.message || error);
    }
  }
);

// Async thunk to fetch detailed attendance
export const fetchAttendanceDetailed = createAsyncThunk(
  'attendanceSummary/fetchAttendanceDetailed',
  async (studentId, { rejectWithValue }) => {
    try {
      const data = await ApiHandler.request(`/student/courses/${studentId}/attendance/detailed`, 'GET');
      return data;
    } catch (error) {
      return rejectWithValue(error.message || error);
    }
  }
);

const attendanceSummarySlice = createSlice({
  name: 'attendanceSummary',
  initialState: {
    summary: null,
    detailed: [],
    loadingSummary: false,
    loadingDetailed: false,
    errorSummary: null,
    errorDetailed: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Summary
      .addCase(fetchAttendanceSummary.pending, (state) => {
        state.loadingSummary = true;
        state.errorSummary = null;
      })
      .addCase(fetchAttendanceSummary.fulfilled, (state, action) => {
        state.loadingSummary = false;
        state.summary = action.payload;
      })
      .addCase(fetchAttendanceSummary.rejected, (state, action) => {
        state.loadingSummary = false;
        state.errorSummary = action.payload;
      })
      // Detailed
      .addCase(fetchAttendanceDetailed.pending, (state) => {
        state.loadingDetailed = true;
        state.errorDetailed = null;
      })
      .addCase(fetchAttendanceDetailed.fulfilled, (state, action) => {
        state.loadingDetailed = false;
        state.detailed = action.payload;
      })
      .addCase(fetchAttendanceDetailed.rejected, (state, action) => {
        state.loadingDetailed = false;
        state.errorDetailed = action.payload;
      });
  },
});

export default attendanceSummarySlice.reducer; 