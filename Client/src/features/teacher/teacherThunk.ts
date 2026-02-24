// teacherThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';
import { TeacherProfile, CourseInfo, StudentInfo } from './teacherType';

// -------------------- LOGIN --------------------
export const loginTeacher = createAsyncThunk(
  'teacher/loginTeacher',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request('/teachers/login', 'POST', credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userType', 'teacher');
      }
      return response.teacher;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Teacher login failed');
    }
  }
);

// -------------------- PROFILE --------------------
export const getProfile = createAsyncThunk<TeacherProfile>(
  'teacher/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await ApiHandler.request('/teachers/profile', 'GET');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk<TeacherProfile, Partial<TeacherProfile>>(
  'teacher/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      return await ApiHandler.request('/teachers/profile', 'PUT', data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

// -------------------- COURSES --------------------
export const getCourses = createAsyncThunk<CourseInfo[]>(
  'teacher/getCourses',
  async (_, { rejectWithValue }) => {
    try {
      return await ApiHandler.request('/teachers/courses', 'GET');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch courses');
    }
  }
);

// -------------------- STUDENTS FOR COURSE --------------------
export const getStudentsForCourse = createAsyncThunk<
  { courseId: string; courseName: string; students: StudentInfo[] },
  string
>('teacher/getStudentsForCourse', async (courseId, { rejectWithValue }) => {
  try {
    return await ApiHandler.request(`/teachers/courses/${courseId}/students`, 'GET');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch students for course');
  }
});

// -------------------- ADD / UPDATE MARKS --------------------
export const addOrUpdateMarks = createAsyncThunk<
  { message: string },
  { courseId: string; marks: { studentId: string; marks: number }[]; examType: string }
>('teacher/addOrUpdateMarks', async (data, { rejectWithValue }) => {
  try {
    return await ApiHandler.request(`/teachers/courses/${data.courseId}/marks`, 'POST', {
      marks: data.marks,
      examType: data.examType
    });
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to add/update marks');
  }
});