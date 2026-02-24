// studentTypes.ts

export interface Course {
  id: string;
  courseName: string;
  courseCode: string;
  creditHours: number;
  department: string;
}

export interface SemesterResult {
  semester: number;
  gpa: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  rollNo: string;
  batch: string;
  semester: number;
  department: string;
  email: string;
  phone?: string;
  address?: string;
  courses?: Course[];
  semesterResults?: SemesterResult[];
}

export interface StudentState {
  loading: boolean;
  error: string | null;
  profile: StudentProfile | null;
  courses: Course[];
  dashboard: {
    totalCredits: number;
    courses: Course[];
  } | null;
  gpaProgress: SemesterResult[];
}