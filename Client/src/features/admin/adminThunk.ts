// adminThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';
import { AdminProfile, Student, Teacher, Course, DashboardStats } from './adminType';

// -------------------- ADMIN AUTH --------------------
export const loginAdmin = createAsyncThunk(
  'admin/loginAdmin',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request('/admin/login', 'POST', credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userType', 'admin');
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Admin login failed');
    }
  }
);

export const getAdminProfile = createAsyncThunk<AdminProfile>(
  'admin/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await ApiHandler.request('/admin/profile', 'GET');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

export const updateAdminProfile = createAsyncThunk<AdminProfile, Partial<AdminProfile>>(
  'admin/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      return await ApiHandler.request('/admin/profile', 'PUT', data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

// -------------------- DASHBOARD --------------------
export const getDashboardStats = createAsyncThunk<DashboardStats>(
  'admin/getDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      return await ApiHandler.request('/admin/dashboard', 'GET');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard stats');
    }
  }
);

// -------------------- STUDENTS --------------------
export const getAllStudents = createAsyncThunk<Student[]>(
  'admin/getAllStudents',
  async (_, { rejectWithValue }) => {
    try {
      return await ApiHandler.request('/admin/students', 'GET');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch students');
    }
  }
);

export const getStudentById = createAsyncThunk<Student, string>(
  'admin/getStudentById',
  async (id, { rejectWithValue }) => {
    try {
      return await ApiHandler.request(`/admin/students/${id}`, 'GET');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch student');
    }
  }
);

export const registerStudent = createAsyncThunk<Student, any>(
  'admin/registerStudent',
  async (data, { rejectWithValue }) => {
    try {
      return await ApiHandler.request('/admin/students', 'POST', data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to register student');
    }
  }
);

export const updateStudent = createAsyncThunk<Student, { id: string; data: any }>(
  'admin/updateStudent',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await ApiHandler.request(`/admin/students/${id}`, 'PUT', data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update student');
    }
  }
);

export const deleteStudent = createAsyncThunk<string, string>(
  'admin/deleteStudent',
  async (id, { rejectWithValue }) => {
    try {
      await ApiHandler.request(`/admin/students/${id}`, 'DELETE');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete student');
    }
  }
);

// -------------------- TEACHERS --------------------
export const getAllTeachers = createAsyncThunk<Teacher[]>(
  'admin/getAllTeachers',
  async (_, { rejectWithValue }) => {
    try {
      return await ApiHandler.request('/admin/teachers', 'GET');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teachers');
    }
  }
);

export const getTeacherById = createAsyncThunk<Teacher, string>(
  'admin/getTeacherById',
  async (id, { rejectWithValue }) => {
    try {
      return await ApiHandler.request(`/admin/teachers/${id}`, 'GET');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teacher');
    }
  }
);

export const registerTeacher = createAsyncThunk<Teacher, any>(
  'admin/registerTeacher',
  async (data, { rejectWithValue }) => {
    try {
      return await ApiHandler.request('/admin/teachers', 'POST', data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to register teacher');
    }
  }
);

export const updateTeacher = createAsyncThunk<Teacher, { id: string; data: any }>(
  'admin/updateTeacher',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await ApiHandler.request(`/admin/teachers/${id}`, 'PUT', data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update teacher');
    }
  }
);

export const deleteTeacher = createAsyncThunk<string, string>(
  'admin/deleteTeacher',
  async (id, { rejectWithValue }) => {
    try {
      await ApiHandler.request(`/admin/teachers/${id}`, 'DELETE');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete teacher');
    }
  }
);

// -------------------- COURSES --------------------
export const getAllCourses = createAsyncThunk<Course[]>(
  'admin/getAllCourses',
  async (_, { rejectWithValue }) => {
    try {
      return await ApiHandler.request('/admin/courses', 'GET');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch courses');
    }
  }
);

export const createCourse = createAsyncThunk<Course, any>(
  'admin/createCourse',
  async (data, { rejectWithValue }) => {
    try {
      return await ApiHandler.request('/admin/courses', 'POST', data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create course');
    }
  }
);

export const updateCourse = createAsyncThunk<Course, { id: string; data: any }>(
  'admin/updateCourse',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await ApiHandler.request(`/admin/courses/${id}`, 'PUT', data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update course');
    }
  }
);

export const deleteCourse = createAsyncThunk<string, string>(
  'admin/deleteCourse',
  async (id, { rejectWithValue }) => {
    try {
      await ApiHandler.request(`/admin/courses/${id}`, 'DELETE');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete course');
    }
  }
);