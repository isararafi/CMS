import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk to update a teacher
export const updateTeacher = createAsyncThunk(
  'updateTeacher/updateTeacher',
  async ({ teacherId, teacherData }, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request(`/admin/teachers/${teacherId}`, 'PATCH', teacherData);
      return response;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to update teacher' });
    }
  }
);

const updateTeacherSlice = createSlice({
  name: 'updateTeacher',
  initialState: {
    updatedTeacher: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearUpdateTeacherState: (state) => {
      state.updatedTeacher = null;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedTeacher = action.payload;
        state.successMessage = 'Teacher updated successfully';
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearUpdateTeacherState } = updateTeacherSlice.actions;
export default updateTeacherSlice.reducer; 