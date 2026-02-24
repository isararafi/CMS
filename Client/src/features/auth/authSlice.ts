import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from './authType';
import { loginStudent, loginTeacher, loginAdmin } from './authThunk';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  userType: (localStorage.getItem('userType') as any) || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userType = null;
      state.error = null;

      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('adminName');
    },
  },
  extraReducers: (builder) => {
    // ================= STUDENT =================
    builder
      .addCase(loginStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginStudent.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userType = action.payload.userType;
        state.user = action.payload.user || null;
      })
      .addCase(loginStudent.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || 'Student login failed';
      });

    // ================= TEACHER =================
    builder
      .addCase(loginTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginTeacher.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userType = action.payload.userType;
        state.user = action.payload.user || null;
      })
      .addCase(loginTeacher.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || 'Teacher login failed';
      });

    // ================= ADMIN =================
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userType = action.payload.userType;
        state.user = action.payload.user || null;
      })
      .addCase(loginAdmin.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || 'Admin login failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;