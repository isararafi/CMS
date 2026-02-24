export interface AdminProfile {
  id?: string;
  name?: string;
  email?: string;
  role?: 'admin';
}

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  semester: number;
  department: string;
  batch: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  education: string;
  department: string;
}

export interface Course {
  id: string;
  courseName: string;
  courseCode: string;
  creditHours: number;
  department: string;
  teacher: Teacher;
  students?: Student[];
}

export interface DashboardStats {
  studentsCount: number;
  teachersCount: number;
}

export interface AdminState {
  loading: boolean;
  error: string | null;
  profile: AdminProfile | null;
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  dashboard: DashboardStats | null;
}