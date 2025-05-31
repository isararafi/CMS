import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Fetch teacher profile
export const fetchTeacherProfile = createAsyncThunk(
  'teacherSettings/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request('/teacher/profile', 'GET');
      console.log('Profile response:', response); // Debug log
      return response;
    } catch (error) {
      console.error('Profile fetch error:', error); // Debug log
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

// Update teacher profile
export const updateTeacherProfile = createAsyncThunk(
  'teacherSettings/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      console.log('Sending update request:', profileData); // Debug log
      const response = await ApiHandler.request(
        '/teacher/profile/update-request',
        'POST',
        profileData
      );
      console.log('Update response:', response); // Debug log
      return response;
    } catch (error) {
      console.error('Update error:', error); // Debug log
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

// Get profile update requests
export const getProfileUpdateRequests = createAsyncThunk(
  'teacherSettings/getUpdateRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request(
        '/teacher/profile/update-request',
        'GET'
      );
      console.log('Update requests response:', response); // Debug log
      return response;
    } catch (error) {
      console.error('Update requests error:', error); // Debug log
      return rejectWithValue(error.message || 'Failed to fetch update requests');
    }
  }
);

const initialState = {
  profile: {
    name: '',
    email: '',
    department: '',
    position: ''
  },
  updateRequests: [],
  isLoading: false,
  error: null,
  successMessage: null
};

const teacherSettingsSlice = createSlice({
  name: 'teacherSettings',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile Cases
      .addCase(fetchTeacherProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeacherProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = {
          name: action.payload.name || '',
          email: action.payload.email || '',
          department: action.payload.department || '',
          position: action.payload.position || ''
        };
        state.error = null;
      })
      .addCase(fetchTeacherProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Profile Cases
      .addCase(updateTeacherProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateTeacherProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = 'Profile update request submitted successfully';
        state.error = null;
      })
      .addCase(updateTeacherProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.successMessage = null;
      })
      // Get Update Requests Cases
      .addCase(getProfileUpdateRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfileUpdateRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updateRequests = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getProfileUpdateRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearMessages } = teacherSettingsSlice.actions;
export default teacherSettingsSlice.reducer; 