// adminSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminState, Student, Teacher, Course, AdminProfile, DashboardStats } from './adminType';
import * as thunks from './adminThunk';

const initialState: AdminState = {
  loading: false,
  error: null,
  profile: null,
  students: [],
  teachers: [],
  courses: [],
  dashboard: null,
};

const adminSlice = createSlice({
  name: 'admin',
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

    // -------------------- HANDLE FULFILLED CASES --------------------
    builder.addCase(thunks.loginAdmin.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.profile = action.payload.admin || null;
    });

    builder.addCase(thunks.getAdminProfile.fulfilled, (state, action: PayloadAction<AdminProfile>) => {
      state.loading = false;
      state.profile = action.payload;
    });

    builder.addCase(thunks.updateAdminProfile.fulfilled, (state, action: PayloadAction<AdminProfile>) => {
      state.loading = false;
      state.profile = action.payload;
    });

    builder.addCase(thunks.getDashboardStats.fulfilled, (state, action: PayloadAction<DashboardStats>) => {
      state.loading = false;
      state.dashboard = action.payload;
    });

    builder.addCase(thunks.getAllStudents.fulfilled, (state, action: PayloadAction<Student[]>) => {
      state.loading = false;
      state.students = action.payload;
    });
    builder.addCase(thunks.getAllTeachers.fulfilled, (state, action: PayloadAction<Teacher[]>) => {
      state.loading = false;
      state.teachers = action.payload;
    });
    builder.addCase(thunks.getAllCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
      state.loading = false;
      state.courses = action.payload;
    });

    // REMOVE STUDENT/TEACHER/COURSE BY ID
    builder.addCase(thunks.deleteStudent.fulfilled, (state, action: PayloadAction<string>) => {
      state.students = state.students.filter((s) => s.id !== action.payload);
    });
    builder.addCase(thunks.deleteTeacher.fulfilled, (state, action: PayloadAction<string>) => {
      state.teachers = state.teachers.filter((t) => t.id !== action.payload);
    });
    builder.addCase(thunks.deleteCourse.fulfilled, (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter((c) => c.id !== action.payload);
    });
  },
});

export default adminSlice.reducer;