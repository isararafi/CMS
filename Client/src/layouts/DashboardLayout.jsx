// Importing necessary React hooks and components
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import styles from '../styles/layouts/dashboardLayout.module.scss'; // Importing scoped CSS module styles

const DashboardLayout = () => {
  // State to track whether the sidebar is collapsed
  const [collapsed, setCollapsed] = useState(false);

  // State to track whether the current device is mobile-sized
  const [isMobile, setIsMobile] = useState(false);

  // Effect to handle window resizing and auto-collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Update mobile state
      if (window.innerWidth < 768) {
        setCollapsed(true); // Auto-collapse sidebar on mobile
      }
    };

    handleResize(); // Initial check on component mount
    window.addEventListener('resize', handleResize); // Add resize listener

    // Cleanup the event listener when component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to toggle sidebar collapsed state
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    // Main dashboard layout container
    <div className={styles.dashboardLayout}>
      {/* Sidebar component with collapse state */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      {/* Main content area that expands when sidebar is collapsed */}
      <div className={`${styles.mainContent} ${collapsed ? styles.expanded : ''}`}>
        {/* Navbar component with toggle sidebar button */}
        <Navbar toggleSidebar={toggleSidebar} />
        
        {/* Wrapper for the page content */}
        <div className={styles.contentWrapper}>
          <div className={styles.pageContent}>
            {/* Render the nested route component */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

// Exporting the layout component
export default DashboardLayout;
