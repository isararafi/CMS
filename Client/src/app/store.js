import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import studentDashboardReducer from '../features/studentDashboard/studentDashboardSlice';
import coursesReducer from '../features/courses/coursesSlice';
import attendanceSummaryReducer from '../features/courses/attendanceSummarySlice';
import adminDashboardReducer from '../features/adminDashboard/adminDashboardSlice';
import addStudentReducer from '../features/adminDashboard/addStudentSlice';
import deleteStudentReducer from '../features/adminDashboard/deleteStudentSlice';
import updateStudentReducer from '../features/adminDashboard/updateStudentSlice';
import addTeacherReducer from '../features/adminDashboard/addTeacherSlice';
import deleteTeacherReducer from '../features/adminDashboard/deleteTeacherSlice';
import updateTeacherReducer from '../features/adminDashboard/updateTeacherSlice';
import teacherDashboardReducer from '../features/teacherDashboard/teacherDashboardSlice';
import teacherAssignmentsReducer from '../features/teacherAssignments/teacherAssignmentsSlice';
import teacherSettingsReducer from '../features/teacherSettings/teacherSettingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    studentDashboard: studentDashboardReducer,
    courses: coursesReducer,
    attendanceSummary: attendanceSummaryReducer,
    adminDashboard: adminDashboardReducer,
    addStudent: addStudentReducer,
    deleteStudent: deleteStudentReducer,
    updateStudent: updateStudentReducer,
    addTeacher: addTeacherReducer,
    deleteTeacher: deleteTeacherReducer,
    updateTeacher: updateTeacherReducer,
    teacherDashboard: teacherDashboardReducer,
    teacherAssignments: teacherAssignmentsReducer,
    teacherSettings: teacherSettingsReducer,
  },
});

export default store; 