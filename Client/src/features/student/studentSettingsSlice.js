import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk to fetch student profile
export const fetchStudentProfile = createAsyncThunk(
  'studentSettings/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const data = await ApiHandler.request('/student/profile', 'GET');
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to fetch profile' });
    }
  }
);

// Async thunk to update student profile
export const updateStudentProfile = createAsyncThunk(
  'studentSettings/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await ApiHandler.request('/student/profile/update', 'PUT', profileData);
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to update profile' });
    }
  }
);

const initialState = {
  profile: null,
  isLoading: false,
  error: null,
  successMessage: null
};

const studentSettingsSlice = createSlice({
  name: 'studentSettings',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile cases
      .addCase(fetchStudentProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchStudentProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch profile';
      })
      // Update profile cases
      .addCase(updateStudentProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateStudentProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
        // Refresh profile data in state
        state.profile = { ...state.profile, ...action.meta.arg };
      })
      .addCase(updateStudentProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to update profile';
      });
  },
});

export const { clearMessages } = studentSettingsSlice.actions;
export default studentSettingsSlice.reducer; 