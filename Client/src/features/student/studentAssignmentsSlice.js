import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../../services/apiHandler';

// Async thunk to fetch student assignments
export const fetchStudentAssignments = createAsyncThunk(
  'studentAssignments/fetchAssignments',
  async (_, { rejectWithValue }) => {
    try {
      const data = await ApiHandler.request('/student/assignments', 'GET');
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to fetch assignments' });
    }
  }
);

const initialState = {
  assignments: [],
  loading: false,
  error: null
};

const studentAssignmentsSlice = createSlice({
  name: 'studentAssignments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload.map(assignment => ({
          id: assignment._id,
          courseCode: assignment.course.courseCode,
          courseName: assignment.course.courseName,
          title: assignment.fileName,
          description: 'Assignment Description', // You might want to add this field in your API
          dueDate: assignment.uploadDate, // You might want to add a separate dueDate field in your API
          posted: assignment.createdAt,
          status: 'pending', // You might want to add a status field in your API
          totalMarks: 100, // You might want to add this field in your API
          weightage: 10, // You might want to add this field in your API
          attachments: [{
            id: assignment._id,
            name: assignment.fileName,
            size: `${Math.round(assignment.fileSize / 1024)} KB`,
            type: assignment.mimeType.split('/')[1],
            url: assignment.fileUrl
          }]
        }));
      })
      .addCase(fetchStudentAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch assignments';
      });
  },
});

export default studentAssignmentsSlice.reducer; 