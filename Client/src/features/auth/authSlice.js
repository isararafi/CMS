import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk for student login
export const loginStudent = createAsyncThunk(
  'auth/loginStudent',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('loginStudent - Making API call with:', credentials);
      
      // Pass false for requireAuth since this is a login request
      const response = await ApiHandler.request('/student/login', 'POST', credentials,null,undefined,false);
      
      console.log('loginStudent - API response:', response);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userType', 'student');
        console.log('loginStudent - Token stored successfully');
      } else {
        console.error('loginStudent - No token in response:', response);
      }
      
      return response;
    } catch (error) {
      console.error('loginStudent - Error:', error);
      return rejectWithValue({ message: error.message || 'Unknown error' });
    }
  }
);

// Teacher
export const loginTeacher = createAsyncThunk(
  'auth/loginTeacher',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('loginTeacher - Making API call with:', credentials);
      
      // Pass false for requireAuth since this is a login request
      const response = await ApiHandler.request('/teacher/login', 'POST', credentials, null, undefined, false);
      
      console.log('loginTeacher - API response:', response);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userType', 'teacher');
        console.log('loginTeacher - Token stored successfully');
      }
      
      return response;
    } catch (error) {
      console.error('loginTeacher - Error:', error);
      return rejectWithValue({ message: error.message || 'Unknown error' });
    }
  }
);

// Admin
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('loginAdmin - Making API call with:', credentials);
      
      // Pass false for requireAuth since this is a login request
      const response = await ApiHandler.request('/admin/login', 'POST', credentials, null, undefined, false);
      
      console.log('loginAdmin - API response:', response);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userType', 'admin');
        
        // Save admin name if present
        if (response.name) {
          localStorage.setItem('adminName', response.name);
        }
        console.log('loginAdmin - Token stored successfully');
      }
      
      return response;
    } catch (error) {
      console.error('loginAdmin - Error:', error);
      return rejectWithValue({ message: error.message || 'Unknown error' });
    }
  }
);

// Thunk to fetch admin profile (this one DOES require auth)
export const fetchAdminProfile = createAsyncThunk(
  'auth/fetchAdminProfile',
  async (_, { rejectWithValue }) => {
    try {
      // This requires auth (default behavior)
      const response = await ApiHandler.request('/admin/profile', 'GET');
      console.log('fetchAdminProfile - API response:', response);
      return response;
    } catch (error) {
      console.error('fetchAdminProfile - Error:', error);
      return rejectWithValue({ message: error.message || 'Failed to fetch admin profile' });
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  userType: localStorage.getItem('userType'),
  adminName: localStorage.getItem('adminName') || '',
  adminEmail: '',
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userType = null;
      state.adminName = '';
      state.adminEmail = '';
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('adminName');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Student login
    builder
      .addCase(loginStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.student;
        state.token = action.payload.token;
        state.userType = 'student';
        state.error = null;
      })
      .addCase(loginStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
      })

    // Teacher login
      .addCase(loginTeacher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginTeacher.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.teacher;
        state.token = action.payload.token;
        state.userType = 'teacher';
        state.error = null;
      })
      .addCase(loginTeacher.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
      })

    // Admin login
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = action.payload.token;
        state.userType = 'admin';
        state.adminName = action.payload.name || '';
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
      })

    // Admin profile
      .addCase(fetchAdminProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminName = action.payload.name || '';
        state.adminEmail = action.payload.email || '';
        state.error = null;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch admin profile';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;