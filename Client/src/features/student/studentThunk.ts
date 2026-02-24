// studentThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';
import { StudentProfile, Course, SemesterResult } from './studentType';

// -------------------- STUDENT LOGIN --------------------
export const loginStudent = createAsyncThunk(
  'student/loginStudent',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request('/students/login', 'POST', credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userType', 'student');
      }
      return response.student;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Student login failed');
    }
  }
);

// -------------------- DASHBOARD --------------------
export const getDashboardInfo = createAsyncThunk<{ totalCredits: number; courses: Course[] }>(
  'student/getDashboardInfo',
  async (_, { rejectWithValue }) => {
    try {
      return await ApiHandler.request('/students/dashboard', 'GET');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard info');
    }
  }
);

// -------------------- GPA / CGPA --------------------
export const getGpaProgress = createAsyncThunk<SemesterResult[]>(
  'student/getGpaProgress',
  async (_, { rejectWithValue }) => {
    try {
      return await ApiHandler.request('/students/gpa', 'GET');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch GPA progress');
    }
  }
);

// -------------------- COURSES --------------------
export const getAvailableCourses = createAsyncThunk<Course[]>(
  'student/getAvailableCourses',
  async (_, { rejectWithValue }) => {
    try {
      return await ApiHandler.request('/students/courses/available', 'GET');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch available courses');
    }
  }
);

export const registerCourses = createAsyncThunk(
  'student/registerCourses',
  async (courseIds: string[], { rejectWithValue }) => {
    try {
      return await ApiHandler.request('/students/courses/register', 'POST', { courseIds });
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to register courses');
    }
  }
);

// -------------------- PROFILE --------------------
export const getProfile = createAsyncThunk<StudentProfile>(
  'student/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await ApiHandler.request('/students/profile', 'GET');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk<StudentProfile, Partial<StudentProfile>>(
  'student/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      return await ApiHandler.request('/students/profile', 'PUT', data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const changePassword = createAsyncThunk(
  'student/changePassword',
  async (data: { currentPassword: string; newPassword: string; confirmNewPassword: string }, { rejectWithValue }) => {
    try {
      return await ApiHandler.request('/students/change-password', 'POST', data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to change password');
    }
  }
);