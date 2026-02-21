import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import studentDashboardReducer from '../features/studentDashboard/studentDashboardSlice';
import coursesReducer from '../features/courses/coursesSlice';
import courseMarksReducer from '../features/courses/courseMarksSlice';
import studentProfileReducer from '../features/student/studentProfileSlice';
import adminDashboardReducer from '../features/adminDashboard/adminDashboardSlice';
import addStudentReducer from '../features/adminDashboard/addStudentSlice';
import deleteStudentReducer from '../features/adminDashboard/deleteStudentSlice';
import updateStudentReducer from '../features/adminDashboard/updateStudentSlice';
import addTeacherReducer from '../features/adminDashboard/addTeacherSlice';
import deleteTeacherReducer from '../features/adminDashboard/deleteTeacherSlice';
import updateTeacherReducer from '../features/adminDashboard/updateTeacherSlice';
import teacherDashboardReducer from '../features/teacherDashboard/teacherDashboardSlice';
import teacherSettingsReducer from '../features/teacherSettings/teacherSettingsSlice';
import courseRegistrationReducer from '../features/courses/courseRegistrationSlice';
import studentSettingsReducer from '../features/student/studentSettingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    studentDashboard: studentDashboardReducer,
    courses: coursesReducer,
    courseMarks: courseMarksReducer,
    studentProfile: studentProfileReducer,
    adminDashboard: adminDashboardReducer,
    addStudent: addStudentReducer,
    deleteStudent: deleteStudentReducer,
    updateStudent: updateStudentReducer,
    addTeacher: addTeacherReducer,
    deleteTeacher: deleteTeacherReducer,
    updateTeacher: updateTeacherReducer,
    teacherDashboard: teacherDashboardReducer,
    teacherSettings: teacherSettingsReducer,
    courseRegistration: courseRegistrationReducer,
    studentSettings: studentSettingsReducer,
  },
});

export default store; 