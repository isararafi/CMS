import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './slices/studentSlice';
import tutorReducer from './slices/teacherSlice';
import adminReducer from './slices/adminSlice';

const store = configureStore({
  reducer: {
    student: studentReducer,
    tutor: tutorReducer,
    admin: adminReducer,
  },
});

export default store;
