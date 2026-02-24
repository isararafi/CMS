export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  role?: 'student' | 'teacher' | 'admin';
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  userType: 'student' | 'teacher' | 'admin' | null;
  loading: boolean;
  error: string | null;
}