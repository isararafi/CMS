import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk to update a student
export const updateStudent = createAsyncThunk(
  'updateStudent/updateStudent',
  async ({ studentId, studentData }, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request(`/admin/students/${studentId}`, 'PATCH', studentData);
      return response;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to update student' });
    }
  }
);

const updateStudentSlice = createSlice({
  name: 'updateStudent',
  initialState: {
    updatedStudent: null,
    loading: false,
    error: null,
    successMessage: '',
  },
  reducers: {
    clearUpdateStudentState: (state) => {
      state.updatedStudent = null;
      state.loading = false;
      state.error = null;
      state.successMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedStudent = action.payload;
        state.successMessage = 'Student updated successfully';
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update student';
      });
  },
});

export const { clearUpdateStudentState } = updateStudentSlice.actions;
export default updateStudentSlice.reducer; 