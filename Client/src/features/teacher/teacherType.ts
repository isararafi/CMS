// teacherTypes.ts

export interface StudentInfo {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  department: string;
}

export interface CourseInfo {
  id: string;
  courseName: string;
  courseCode?: string;
  creditHours?: number;
  department?: string;
  students?: StudentInfo[];
}

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  education?: string;
  department?: string;
}

export interface TeacherState {
  loading: boolean;
  error: string | null;
  profile: TeacherProfile | null;
  courses: CourseInfo[];
}