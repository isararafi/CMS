import React, { useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import styles from '../styles/pages/teacherDashboard.module.scss';
import { fetchTeacherProfile, fetchTeacherCourses } from '../features/teacherDashboard/teacherDashboardSlice';
import { useToast } from '../context/ToastContext';

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { profile, courses, isLoading, error } = useSelector(state => state.teacherDashboard);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchTeacherProfile()).unwrap(),
          dispatch(fetchTeacherCourses()).unwrap()
        ]);
        showToast('Dashboard data loaded successfully', 'success');
      } catch (error) {
        showToast(error.message || 'Failed to load dashboard data', 'error');
      }
    };
    
    fetchData();
  }, [dispatch]);

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} role="tutor" />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        {/* <Navbar toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} /> */}
        <div className={styles.contentWrapper}>
          <div className={styles.pageContent}>
            <div className={styles.dashboardHeader}>
              <div className={styles.welcomeSection}>
                <h1>Welcome, {profile.name}</h1>
                <p className={styles.subtitle}>Email: {profile.email}</p>
              </div>
            </div>
            <div className={styles.tabContent}>
              {isLoading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>Error: {error}</p>
              ) : (
                <div>
                  <h2>Your Courses</h2> 
                   <ul>
                    {courses.map(course => (
                      <li key={course._id}>
                        {course.courseCode} - {course.courseName} (Students: {course.students.length})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 