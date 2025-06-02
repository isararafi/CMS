// Importing Redux Toolkit functions and API handler
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// ✅ Async thunk to handle teacher registration API call
export const registerTeacher = createAsyncThunk(
  'addTeacher/registerTeacher', // Action type
  async (teacherData, { rejectWithValue }) => {
    try {
      // Sending POST request to backend with teacher data
      const response = await ApiHandler.request('/admin/register/teacher', 'POST', teacherData);
      return response; // If successful, return the response
    } catch (error) {
      // If error, return a rejected value with error message
      return rejectWithValue({ message: error.message || 'Failed to register teacher' });
    }
  }
);

// ✅ Creating a slice for addTeacher feature
const addTeacherSlice = createSlice({
  name: 'addTeacher', // Name of the slice
  initialState: {
    teacher: null,           // Stores teacher data after successful registration
    loading: false,          // Shows loading status while API call is running
    error: null,             // Stores any error message
    successMessage: '',      // Stores success message after registration
  },
  reducers: {
    // ✅ Reducer to reset/clear the add teacher state
    clearAddTeacherState: (state) => {
      state.teacher = null;
      state.loading = false;
      state.error = null;
      state.successMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ When API call is pending (in progress)
      .addCase(registerTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      // ✅ When API call is successful
      .addCase(registerTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.teacher = action.payload.teacher; // Save returned teacher data
        state.successMessage = action.payload.message || 'Teacher registered successfully';
      })
      // ✅ When API call fails
      .addCase(registerTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to register teacher';
      });
  },
});

// ✅ Exporting the clear function to use in components
export const { clearAddTeacherState } = addTeacherSlice.actions;

// ✅ Exporting the reducer so it can be added to the Redux store
export default addTeacherSlice.reducer;
