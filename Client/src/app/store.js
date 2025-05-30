import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import studentDashboardReducer from '../features/studentDashboard/studentDashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    studentDashboard: studentDashboardReducer,
  },
});

export default store; 