// teacherSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TeacherState, TeacherProfile, CourseInfo } from './teacherType';
import * as thunks from './teacherThunk';

const initialState: TeacherState = {
  loading: false,
  error: null,
  profile: null,
  courses: [],
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {},  
  extraReducers: (builder) => {

    // ============================
    // LOGIN TEACHER
    // ============================

    builder.addCase(thunks.loginTeacher.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      thunks.loginTeacher.fulfilled,
      (state, action: PayloadAction<TeacherProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      }
    );

    builder.addCase(thunks.loginTeacher.rejected, (state, action: any) => {
      state.loading = false;
      state.error =
        action.payload || action.error.message || 'Login failed';
    });


    // ============================
    // GET PROFILE
    // ============================

    builder.addCase(thunks.getProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      thunks.getProfile.fulfilled,
      (state, action: PayloadAction<TeacherProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      }
    );

    builder.addCase(thunks.getProfile.rejected, (state, action: any) => {
      state.loading = false;
      state.error =
        action.payload || action.error.message || 'Failed to fetch profile';
    });


    // ============================
    // UPDATE PROFILE
    // ============================

    builder.addCase(thunks.updateProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      thunks.updateProfile.fulfilled,
      (state, action: PayloadAction<TeacherProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      }
    );

    builder.addCase(thunks.updateProfile.rejected, (state, action: any) => {
      state.loading = false;
      state.error =
        action.payload || action.error.message || 'Failed to update profile';
    });


    // ============================
    // GET COURSES
    // ============================

    builder.addCase(thunks.getCourses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      thunks.getCourses.fulfilled,
      (state, action: PayloadAction<CourseInfo[]>) => {
        state.loading = false;
        state.courses = action.payload;
      }
    );

    builder.addCase(thunks.getCourses.rejected, (state, action: any) => {
      state.loading = false;
      state.error =
        action.payload || action.error.message || 'Failed to fetch courses';
    });

  },
});

export default teacherSlice.reducer;