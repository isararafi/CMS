import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk to register a student
export const registerStudent = createAsyncThunk(
  'addStudent/registerStudent',
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request('/admin/register/student', 'POST', studentData);
      return response;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to register student' });
    }
  }
);

const addStudentSlice = createSlice({
  name: 'addStudent',
  initialState: {
    student: null,
    loading: false,
    error: null,
    successMessage: '',
  },
  reducers: {
    clearAddStudentState: (state) => {
      state.student = null;
      state.loading = false;
      state.error = null;
      state.successMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(registerStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload.student;
        state.successMessage = action.payload.message || 'Student registered successfully';
      })
      .addCase(registerStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to register student';
      });
  },
});

export const { clearAddStudentState } = addStudentSlice.actions;
export default addStudentSlice.reducer; 