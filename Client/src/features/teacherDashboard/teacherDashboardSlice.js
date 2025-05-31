import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk to fetch teacher profile
export const fetchTeacherProfile = createAsyncThunk(
  'teacherDashboard/fetchTeacherProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request('/teacher/profile', 'GET');
      console.log('fetchTeacherProfile - API response:', response);
      return response;
    } catch (error) {
      console.error('fetchTeacherProfile - Error:', error);
      return rejectWithValue({ message: error.message || 'Failed to fetch teacher profile' });
    }
  }
);

// Async thunk to fetch teacher courses
export const fetchTeacherCourses = createAsyncThunk(
  'teacherDashboard/fetchTeacherCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request('/teacher/courses', 'GET');
      console.log('fetchTeacherCourses - API response:', response);
      return response;
    } catch (error) {
      console.error('fetchTeacherCourses - Error:', error);
      return rejectWithValue({ message: error.message || 'Failed to fetch teacher courses' });
    }
  }
);

// Async thunk to add a lecture
export const addLecture = createAsyncThunk(
  'teacherDashboard/addLecture',
  async (lectureData, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request('/teacher/lectures', 'POST', lectureData);
      console.log('addLecture - API response:', response);
      return response;
    } catch (error) {
      console.error('addLecture - Error:', error);
      return rejectWithValue({ message: error.message || 'Failed to add lecture' });
    }
  }
);

// Async thunk to fetch students
export const fetchStudents = createAsyncThunk(
  'teacherDashboard/fetchStudents',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request(`/teacher/students/${courseId}`, 'GET');
      console.log('fetchStudents - API response:', response);
      return response;
    } catch (error) {
      console.error('fetchStudents - Error:', error);
      return rejectWithValue({ message: error.message || 'Failed to fetch students' });
    }
  }
);

// Async thunk to mark attendance
export const markAttendance = createAsyncThunk(
  'teacherDashboard/markAttendance',
  async ({ lectureId, attendanceData }, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request('/teacher/attendance/mark', 'POST', { lectureId, attendanceData });
      console.log('markAttendance - API response:', response);
      return response;
    } catch (error) {
      console.error('markAttendance - Error:', error);
      return rejectWithValue({ message: error.message || 'Failed to mark attendance' });
    }
  }
);

// Async thunk to fetch lectures
export const fetchLectures = createAsyncThunk(
  'teacherDashboard/fetchLectures',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request(`/teacher/courses/${courseId}/lectures`, 'GET');
      console.log('fetchLectures - API response:', response);
      return response;
    } catch (error) {
      console.error('fetchLectures - Error:', error);
      return rejectWithValue({ message: error.message || 'Failed to fetch lectures' });
    }
  }
);

const teacherDashboardSlice = createSlice({
  name: 'teacherDashboard',
  initialState: {
    profile: {
      name: '',
      email: '',
    },
    courses: [],
    students: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeacherProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile.name = action.payload.name;
        state.profile.email = action.payload.email;
        state.error = null;
      })
      .addCase(fetchTeacherProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch teacher profile';
      })
      .addCase(fetchTeacherCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeacherCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload;
        state.error = null;
      })
      .addCase(fetchTeacherCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch teacher courses';
      })
      .addCase(addLecture.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addLecture.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = state.courses.map(course => {
          if (course._id === action.payload.course) {
            return {
              ...course,
              lectures: [...(course.lectures || []), action.payload]
            };
          }
          return course;
        });
        state.error = null;
      })
      .addCase(addLecture.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to add lecture';
      })
      .addCase(fetchStudents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students = action.payload;
        state.error = null;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch students';
      })
      .addCase(markAttendance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to mark attendance';
      })
      .addCase(fetchLectures.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLectures.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lectures = action.payload;
        state.error = null;
      })
      .addCase(fetchLectures.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch lectures';
      });
  },
});

export default teacherDashboardSlice.reducer; 