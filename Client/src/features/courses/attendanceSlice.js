import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk for fetching attendance summary
export const fetchAttendanceSummary = createAsyncThunk(
  'attendance/fetchSummary',
  async (courseId, { rejectWithValue }) => {
    try {
      const data = await ApiHandler.request(`/student/courses/${courseId}/attendance/summary`, 'GET');
      return { courseId, data };
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to fetch attendance summary' });
    }
  }
);

// Async thunk for fetching detailed attendance
export const fetchAttendanceDetailed = createAsyncThunk(
  'attendance/fetchDetailed',
  async (courseId, { rejectWithValue }) => {
    try {
      const data = await ApiHandler.request(`/student/courses/${courseId}/attendance/detailed`, 'GET');
      return { courseId, data };
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to fetch detailed attendance' });
    }
  }
);

const initialState = {
  summaries: {},
  details: {},
  loading: false,
  error: null
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Summary cases
      .addCase(fetchAttendanceSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summaries[action.payload.courseId] = action.payload.data;
      })
      .addCase(fetchAttendanceSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch attendance summary';
      })
      // Detailed cases
      .addCase(fetchAttendanceDetailed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceDetailed.fulfilled, (state, action) => {
        state.loading = false;
        state.details[action.payload.courseId] = action.payload.data;
      })
      .addCase(fetchAttendanceDetailed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch detailed attendance';
      });
  },
});

export default attendanceSlice.reducer; 