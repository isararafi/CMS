import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiHandler from '../../services/apiHandler';

// Async thunk for student login
export const loginStudent = createAsyncThunk(
  'auth/loginStudent',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiHandler.post('/student/login', credentials);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', 'student');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for teacher login
export const loginTeacher = createAsyncThunk(
  'auth/loginTeacher',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiHandler.post('/teacher/login', credentials);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', 'teacher');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for admin login
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiHandler.post('/admin/login', credentials);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', 'admin');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  userType: localStorage.getItem('userType'),
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
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
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
        state.user = action.payload.admin;
        state.token = action.payload.token;
        state.userType = 'admin';
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 