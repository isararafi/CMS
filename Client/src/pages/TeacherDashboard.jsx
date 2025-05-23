import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import styles from '../styles/pages/teacherDashboard.module.scss';

const TeacherDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} role="tutor" />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className={styles.contentWrapper}>
          <div className={styles.pageContent}>
            <div className={styles.dashboardHeader}>
              <div className={styles.welcomeSection}>
                <h1>Teacher Dashboard</h1>
                <p className={styles.subtitle}>Faculty Portal</p>
              </div>
            </div>
            <div className={styles.tabContent}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 