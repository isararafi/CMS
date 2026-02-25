// studentSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StudentState, StudentProfile, Course, SemesterResult } from './studentType';
import * as thunks from './studentThunk';

const initialState: StudentState = {
  loading: false,
  error: null,
  profile: null,
  courses: [],
  dashboard: null,
  gpaProgress: [],
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    // ================= LOGIN STUDENT =================
    builder
      .addCase(thunks.loginStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.loginStudent.fulfilled, (state, action: PayloadAction<StudentProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(thunks.loginStudent.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Something went wrong';
      });

    // ================= DASHBOARD INFO =================
    builder
      .addCase(thunks.getDashboardInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        thunks.getDashboardInfo.fulfilled,
        (state, action: PayloadAction<{ totalCredits: number; courses: Course[] }>) => {
          state.loading = false;
          state.dashboard = action.payload;
        }
      )
      .addCase(thunks.getDashboardInfo.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Something went wrong';
      });

    // ================= GPA PROGRESS =================
    builder
      .addCase(thunks.getGpaProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.getGpaProgress.fulfilled, (state, action: PayloadAction<SemesterResult[]>) => {
        state.loading = false;
        state.gpaProgress = action.payload;
      })
      .addCase(thunks.getGpaProgress.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Something went wrong';
      });

    // ================= AVAILABLE COURSES =================
    builder
      .addCase(thunks.getAvailableCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.getAvailableCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(thunks.getAvailableCourses.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Something went wrong';
      });

    // ================= GET PROFILE =================
    builder
      .addCase(thunks.getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.getProfile.fulfilled, (state, action: PayloadAction<StudentProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(thunks.getProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Something went wrong';
      });

    // ================= UPDATE PROFILE =================
    builder
      .addCase(thunks.updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.updateProfile.fulfilled, (state, action: PayloadAction<StudentProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(thunks.updateProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Something went wrong';
      });
  },
});

export default studentSlice.reducer;