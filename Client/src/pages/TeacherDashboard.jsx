import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import styles from '../styles/pages/teacherDashboard.module.scss';

const TeacherDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock profile and courses data
  const profile = {
    name: 'Muhammad Shahzeb',
    email: 'muhammadshahzeb2782@gmail.com'
  };

  const courses = [
    { _id: 1, courseCode: 'CS101', courseName: 'Programming Fundamentals', students: [1, 2, 3] },
    { _id: 2, courseCode: 'CS102', courseName: 'Data Structures', students: [1, 2] },
    { _id: 3, courseCode: 'CS103', courseName: 'Databases', students: [1] }
  ];

  const isLoading = false;
  const error = null;

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