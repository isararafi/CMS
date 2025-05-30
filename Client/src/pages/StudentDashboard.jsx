import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { fetchDashboardInfo, fetchGpaProgress } from '../features/studentDashboard/studentDashboardSlice';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import styles from '../styles/pages/studentDashboard.module.scss';

const StudentDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dispatch = useDispatch();
  const { dashboardInfo, gpaProgress, isLoading, error } = useSelector((state) => state.studentDashboard);

  useEffect(() => {
    dispatch(fetchDashboardInfo());
    dispatch(fetchGpaProgress());
  }, [dispatch]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.dashboardLayout}>
      {/* Decorative elements */}
      <div className={styles.decorativeWave}></div>
      <div className={styles.decorativeTriangle}></div>
      <div className={styles.decorativeCircle}></div>
      <div className={styles.decorativeDots}></div>
      <div className={styles.decorativeDiamond}></div>
      
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} role="student" />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <div className={styles.contentWrapper}>
          <div className={styles.pageContent}>
            <div className={styles.dashboardHeader}>
              <div className={styles.welcomeSection}>
                <h1>Welcome, {dashboardInfo.name}</h1>
                <p className={styles.subtitle}>Student Dashboard</p>
              </div>
              <div className={styles.studentInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Roll No:</span>
                  <span className={styles.value}>{dashboardInfo.rollNo}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Semester:</span>
                  <span className={styles.value}>{dashboardInfo.semester}</span>
                </div>
              </div>
            </div>

            <div className={styles.statsContainer}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><Award size={24} /></div>
                <div className={styles.statContent}>
                  <h3 className={styles.statValue}>{dashboardInfo.cgpa}</h3>
                  <p className={styles.statLabel}>Current GPA</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><BookOpen size={24} /></div>
                <div className={styles.statContent}>
                  <h3 className={styles.statValue}>{dashboardInfo.enrolledCourses.length}</h3>
                  <p className={styles.statLabel}>Courses Enrolled</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><Clock size={24} /></div>
                <div className={styles.statContent}>
                  <h3 className={styles.statValue}>{dashboardInfo.attendanceRate}%</h3>
                  <p className={styles.statLabel}>Attendance Rate</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><GraduationCap size={24} /></div>
                <div className={styles.statContent}>
                  <h3 className={styles.statValue}>{dashboardInfo.totalCredits}</h3>
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
                    data={gpaProgress}
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