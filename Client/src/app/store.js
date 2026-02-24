import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import adminReducer from '../features/auth/adminSlice';
import teacherReducer from '../features/auth/teacherSlice';
import studentReducer from '../features/auth/studentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    teacher: teacherReducer,
    student: studentReducer
  },
});

export default store; 