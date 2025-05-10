import React, { useState } from 'react';
import { 
  Calendar, 
  BookOpen, 
  Award, 
  Clock, 
  BarChart2, 
  FileText,
  CreditCard,
  GraduationCap,
  ClipboardList,
  Settings,
  BookOpenCheck,
  PenTool,
  CheckSquare
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import styles from '../styles/pages/dashboard.module.scss';

const StudentDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data - would be fetched from API in real application
  const studentData = {
    name: "John Smith",
    rollNo: "Fall 23-BSSE-123",
    department: "Software Engineering",
    gpa: 3.75,
    attendance: 92,
    semester: "Fall 2023",
    courses: [
      { id: 1, code: "CSE101", name: "Introduction to Programming", progress: 85, grade: "A", credits: 3 },
      { id: 2, code: "CSE201", name: "Data Structures and Algorithms", progress: 72, grade: "B+", credits: 4 },
      { id: 3, code: "MAT202", name: "Discrete Mathematics", progress: 91, grade: "A", credits: 3 },
      { id: 4, code: "ENG101", name: "Technical Communication", progress: 78, grade: "B", credits: 2 }
    ],
    semesterGPAs: [
      { name: 'Fall 2021', gpa: 3.5 },
      { name: 'Spring 2022', gpa: 3.7 },
      { name: 'Fall 2022', gpa: 3.6 },
      { name: 'Spring 2023', gpa: 3.8 },
      { name: 'Fall 2023', gpa: 3.75 }
    ]
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={styles.dashboardLayout}>
      {/* Decorative elements */}
      <div className={styles.decorativeWave}></div>
      <div className={styles.decorativeTriangle}></div>
      <div className={styles.decorativeCircle}></div>
      <div className={styles.decorativeDots}></div>
      <div className={styles.decorativeDiamond}></div>
      
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <div className={styles.contentWrapper}>
          <div className={styles.pageContent}>
            <div className={styles.dashboardHeader}>
              <div className={styles.welcomeSection}>
                <h1>Welcome, {studentData.name}</h1>
                <p className={styles.subtitle}>Student Dashboard • {studentData.department}</p>
              </div>
              <div className={styles.studentInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Roll No:</span>
                  <span className={styles.value}>{studentData.rollNo}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Semester:</span>
                  <span className={styles.value}>{studentData.semester}</span>
                </div>
              </div>
            </div>

            <div className={styles.statsContainer}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><Award size={24} /></div>
                <div className={styles.statContent}>
                  <h3 className={styles.statValue}>{studentData.gpa}</h3>
                  <p className={styles.statLabel}>Current GPA</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><BookOpen size={24} /></div>
                <div className={styles.statContent}>
                  <h3 className={styles.statValue}>{studentData.courses.length}</h3>
                  <p className={styles.statLabel}>Courses Enrolled</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><Clock size={24} /></div>
                <div className={styles.statContent}>
                  <h3 className={styles.statValue}>{studentData.attendance}%</h3>
                  <p className={styles.statLabel}>Attendance Rate</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><GraduationCap size={24} /></div>
                <div className={styles.statContent}>
                  <h3 className={styles.statValue}>{studentData.courses.reduce((acc, course) => acc + course.credits, 0)}</h3>
                  <p className={styles.statLabel}>Total Credits</p>
                </div>
              </div>
            </div>

            <div className={styles.gpaChartContainer}>
              <div className={styles.chartHeader}>
                <h2>Semester-wise GPA Progress</h2>
                <p>Your academic performance over the semesters</p>
              </div>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={studentData.semesterGPAs}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#666' }}
                      tickLine={{ stroke: '#666' }}
                    />
                    <YAxis 
                      domain={[0, 4]} 
                      tick={{ fill: '#666' }}
                      tickLine={{ stroke: '#666' }}
                      tickCount={9}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '10px'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="gpa"
                      name="GPA"
                      stroke="#2E7D32"
                      strokeWidth={2}
                      dot={{ fill: '#2E7D32', r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 