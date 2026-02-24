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
    builder.addCase(thunks.loginStudent.fulfilled, (state, action: PayloadAction<StudentProfile>) => {
      state.loading = false;
      state.profile = action.payload;
    });

    builder.addCase(thunks.getDashboardInfo.fulfilled, (state, action: PayloadAction<{ totalCredits: number; courses: Course[] }>) => {
      state.loading = false;
      state.dashboard = action.payload;
    });

    builder.addCase(thunks.getGpaProgress.fulfilled, (state, action: PayloadAction<SemesterResult[]>) => {
      state.loading = false;
      state.gpaProgress = action.payload;
    });

    builder.addCase(thunks.getAvailableCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
      state.loading = false;
      state.courses = action.payload;
    });

    builder.addCase(thunks.getProfile.fulfilled, (state, action: PayloadAction<StudentProfile>) => {
      state.loading = false;
      state.profile = action.payload;
    });

    builder.addCase(thunks.updateProfile.fulfilled, (state, action: PayloadAction<StudentProfile>) => {
      state.loading = false;
      state.profile = action.payload;
    });
  },
});

export default studentSlice.reducer;