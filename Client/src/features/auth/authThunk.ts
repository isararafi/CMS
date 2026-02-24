// authThunk.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// ================= STUDENT LOGIN =================
export const loginStudent = createAsyncThunk(
  'auth/loginStudent',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request(
        '/students/login',
        'POST',
        credentials,
        null,
        undefined,
        false
      );

      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userType', 'student');
      }

      return { ...response, userType: 'student' };
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Student login failed',
      });
    }
  }
);

// ================= TEACHER LOGIN =================
export const loginTeacher = createAsyncThunk(
  'auth/loginTeacher',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request(
        '/teachers/login',
        'POST',
        credentials,
        null,
        undefined,
        false
      );

      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userType', 'teacher');
      }

      return { ...response, userType: 'teacher' };
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Teacher login failed',
      });
    }
  }
);

// ================= ADMIN LOGIN =================
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request(
        '/admin/login',
        'POST',
        credentials,
        null,
        undefined,
        false
      );

      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userType', 'admin');

        if (response.name) {
          localStorage.setItem('adminName', response.name);
        }
      }

      return { ...response, userType: 'admin' };
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Admin login failed',
      });
    }
  }
);