import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk to delete a student
export const deleteStudent = createAsyncThunk(
  'deleteStudent/deleteStudent',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request(`/admin/students/${studentId}`, 'DELETE');
      return response;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to delete student' });
    }
  }
);

const deleteStudentSlice = createSlice({
  name: 'deleteStudent',
  initialState: {
    message: '',
    loading: false,
    error: null,
  },
  reducers: {
    clearDeleteStudentState: (state) => {
      state.message = '';
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = '';
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || 'Student deleted successfully';
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete student';
      });
  },
});

export const { clearDeleteStudentState } = deleteStudentSlice.actions;
export default deleteStudentSlice.reducer; 