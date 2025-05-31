import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk for uploading assignment
export const uploadAssignment = createAsyncThunk(
  'teacherAssignments/uploadAssignment',
  async (assignmentData, { rejectWithValue }) => {
    try {
      // Create FormData object to handle file upload
      const formData = new FormData();
      formData.append('title', assignmentData.title);
      formData.append('description', assignmentData.description);
      formData.append('courseId', assignmentData.courseId);
      formData.append('dueDate', assignmentData.dueDate);
      
      // Append the file
      if (assignmentData.file) {
        formData.append('file', assignmentData.file);
      }

      const response = await ApiHandler.request(
        '/teacher/assignments/upload',
        'POST',
        formData, // Send as FormData
        null,
        {} // No custom headers needed as ApiHandler will handle multipart/form-data
      );
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload assignment');
    }
  }
);

const teacherAssignmentsSlice = createSlice({
  name: 'teacherAssignments',
  initialState: {
    assignments: [],
    isLoading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadAssignment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(uploadAssignment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignments.push(action.payload);
        state.successMessage = 'Assignment uploaded successfully';
      })
      .addCase(uploadAssignment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearMessages } = teacherAssignmentsSlice.actions;
export default teacherAssignmentsSlice.reducer; 