import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import studentDashboardReducer from '../features/studentDashboard/studentDashboardSlice';
import coursesReducer from '../features/courses/coursesSlice';
import attendanceSummaryReducer from '../features/courses/attendanceSummarySlice';
import adminDashboardReducer from '../features/adminDashboard/adminDashboardSlice';
import addStudentReducer from '../features/adminDashboard/addStudentSlice';
import deleteStudentReducer from '../features/adminDashboard/deleteStudentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    studentDashboard: studentDashboardReducer,
    courses: coursesReducer,
    attendanceSummary: attendanceSummaryReducer,
    adminDashboard: adminDashboardReducer,
    addStudent: addStudentReducer,
    deleteStudent: deleteStudentReducer,
  },
});

export default store; 