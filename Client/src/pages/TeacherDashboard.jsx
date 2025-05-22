import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import styles from '../styles/pages/teacherDashboard.module.scss';

const TeacherDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
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
            <div className={styles.tabsContainer}>
              <NavLink to="attendance" className={({isActive}) => isActive ? styles.activeTab : styles.tab}>Attendance</NavLink>
              <NavLink to="marks" className={({isActive}) => isActive ? styles.activeTab : styles.tab}>Marks</NavLink>
              <NavLink to="assignments" className={({isActive}) => isActive ? styles.activeTab : styles.tab}>Assignments</NavLink>
              <NavLink to="settings" className={({isActive}) => isActive ? styles.activeTab : styles.tab}>Settings</NavLink>
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