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

    // ================= LOGIN ADMIN =================
    builder
      .addCase(thunks.loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.loginAdmin.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.profile = action.payload.admin || null;
      })
      .addCase(thunks.loginAdmin.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Something went wrong';
      });

    // ================= GET ADMIN PROFILE =================
    builder
      .addCase(thunks.getAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.getAdminProfile.fulfilled, (state, action: PayloadAction<AdminProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(thunks.getAdminProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Something went wrong';
      });

    // ================= UPDATE ADMIN PROFILE =================
    builder
      .addCase(thunks.updateAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.updateAdminProfile.fulfilled, (state, action: PayloadAction<AdminProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(thunks.updateAdminProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Something went wrong';
      });

    // ================= DASHBOARD STATS =================
    builder
      .addCase(thunks.getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.getDashboardStats.fulfilled, (state, action: PayloadAction<DashboardStats>) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(thunks.getDashboardStats.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Something went wrong';
      });

    // ================= GET ALL STUDENTS =================
    builder
      .addCase(thunks.getAllStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.getAllStudents.fulfilled, (state, action: PayloadAction<Student[]>) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(thunks.getAllStudents.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Something went wrong';
      });

    // ================= GET ALL TEACHERS =================
    builder
      .addCase(thunks.getAllTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.getAllTeachers.fulfilled, (state, action: PayloadAction<Teacher[]>) => {
        state.loading = false;
        state.teachers = action.payload;
      })
      .addCase(thunks.getAllTeachers.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Something went wrong';
      });

    // ================= GET ALL COURSES =================
    builder
      .addCase(thunks.getAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.getAllCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(thunks.getAllCourses.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Something went wrong';
      });

    // ================= DELETE STUDENT =================
    builder
      .addCase(thunks.deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.deleteStudent.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.students = state.students.filter((s) => s.id !== action.payload);
      })
      .addCase(thunks.deleteStudent.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Something went wrong';
      });

    // ================= DELETE TEACHER =================
    builder
      .addCase(thunks.deleteTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.deleteTeacher.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.teachers = state.teachers.filter((t) => t.id !== action.payload);
      })
      .addCase(thunks.deleteTeacher.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Something went wrong';
      });

    // ================= DELETE COURSE =================
    builder
      .addCase(thunks.deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.deleteCourse.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.courses = state.courses.filter((c) => c.id !== action.payload);
      })
      .addCase(thunks.deleteCourse.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Something went wrong';
      });

  },
});

export default adminSlice.reducer;