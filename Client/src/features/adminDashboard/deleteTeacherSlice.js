import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk to delete a teacher
export const deleteTeacher = createAsyncThunk(
  'deleteTeacher/deleteTeacher',
  async (teacherId, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request(`/admin/teachers/${teacherId}`, 'DELETE');
      return response;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to delete teacher' });
    }
  }
);

const deleteTeacherSlice = createSlice({
  name: 'deleteTeacher',
  initialState: {
    message: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearDeleteTeacherState: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(deleteTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearDeleteTeacherState } = deleteTeacherSlice.actions;
export default deleteTeacherSlice.reducer; 