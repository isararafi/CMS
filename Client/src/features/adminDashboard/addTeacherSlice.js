import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk to register a teacher
export const registerTeacher = createAsyncThunk(
  'addTeacher/registerTeacher',
  async (teacherData, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request('/admin/register/teacher', 'POST', teacherData);
      return response;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to register teacher' });
    }
  }
);

const addTeacherSlice = createSlice({
  name: 'addTeacher',
  initialState: {
    teacher: null,
    loading: false,
    error: null,
    successMessage: '',
  },
  reducers: {
    clearAddTeacherState: (state) => {
      state.teacher = null;
      state.loading = false;
      state.error = null;
      state.successMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(registerTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.teacher = action.payload.teacher;
        state.successMessage = action.payload.message || 'Teacher registered successfully';
      })
      .addCase(registerTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to register teacher';
      });
  },
});

export const { clearAddTeacherState } = addTeacherSlice.actions;
export default addTeacherSlice.reducer; 