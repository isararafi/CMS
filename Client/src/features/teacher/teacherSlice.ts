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
    // -------------------- GENERIC PENDING --------------------
    builder.addMatcher(
      (action) => action.type.endsWith('/pending'),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    // -------------------- GENERIC REJECTED --------------------
    builder.addMatcher(
      (action) => action.type.endsWith('/rejected'),
      (state, action: any) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Something went wrong';
      }
    );

    // -------------------- FULFILLED CASES --------------------
    builder.addCase(thunks.loginTeacher.fulfilled, (state, action: PayloadAction<TeacherProfile>) => {
      state.loading = false;
      state.profile = action.payload;
    });

    builder.addCase(thunks.getProfile.fulfilled, (state, action: PayloadAction<TeacherProfile>) => {
      state.loading = false;
      state.profile = action.payload;
    });

    builder.addCase(thunks.updateProfile.fulfilled, (state, action: PayloadAction<TeacherProfile>) => {
      state.loading = false;
      state.profile = action.payload;
    });

    builder.addCase(thunks.getCourses.fulfilled, (state, action: PayloadAction<CourseInfo[]>) => {
      state.loading = false;
      state.courses = action.payload;
    });
  },
});

export default teacherSlice.reducer;