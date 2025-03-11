import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  BarChart2, 
  Users, 
  Settings, 
  FileText, 
  Calendar, 
  Menu, 
  ChevronLeft,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Building
} from 'lucide-react';
// import logo from '../../assets/logo.png'; // Add your logo to assets folder
import styles from '../../styles/components/sidebar.module.scss';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPath, setCurrentPath] = useState('/dashboard');
  
  // Use try-catch to handle the case when the component is rendered outside Router context
  let location;
  try {
    location = useLocation();
    // Update currentPath when location is available
    useEffect(() => {
      if (location) {
        setCurrentPath(location.pathname);
      }
    }, [location]);
  } catch (error) {
    console.warn("Sidebar is not within Router context. Using fallback navigation.");
    // We'll use the currentPath state instead
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    handleResize(); // Check on initial load
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setCollapsed]);

  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} strokeWidth={1.5} />, path: '/dashboard' },
    { name: 'Students', icon: <GraduationCap size={20} strokeWidth={1.5} />, path: '/students' },
    { name: 'Faculty', icon: <Users size={20} strokeWidth={1.5} />, path: '/faculty' },
    { name: 'Courses', icon: <BookOpen size={20} strokeWidth={1.5} />, path: '/courses' },
    { name: 'Attendance', icon: <ClipboardList size={20} strokeWidth={1.5} />, path: '/attendance' },
    { name: 'Departments', icon: <Building size={20} strokeWidth={1.5} />, path: '/departments' },
    { name: 'Reports', icon: <FileText size={20} strokeWidth={1.5} />, path: '/reports' },
    { name: 'Calendar', icon: <Calendar size={20} strokeWidth={1.5} />, path: '/calendar' },
    { name: 'Analytics', icon: <BarChart2 size={20} strokeWidth={1.5} />, path: '/analytics' },
    { name: 'Settings', icon: <Settings size={20} strokeWidth={1.5} />, path: '/settings' },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Handle navigation without Router context
  const handleNavigation = (path) => {
    if (location) {
      // We're in a Router context, so navigation will work normally via Link
      return;
    } else {
      // We're not in a Router context, so we'll just update our state
      setCurrentPath(path);
      // You might want to add additional logic here for non-Router navigation
      console.log(`Would navigate to: ${path}`);
    }
  };

  // Get the current path, either from Router or from our state
  const activePath = location ? location.pathname : currentPath;

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${isMobile ? styles.mobile : ''}`}>
      <div className={styles.sidebarHeader}>
        {!collapsed && (
          <div className={styles.logoContainer}>
            {/* <img src={logo} alt="Logo" className={styles.logo} /> */}
            <h1 className={styles.title}>Campus MS</h1>
          </div>
        )}
        <button onClick={toggleSidebar} className={styles.toggleButton}>
          {collapsed ? <Menu size={20} strokeWidth={1.5} /> : <ChevronLeft size={20} strokeWidth={1.5} />}
        </button>
      </div>

      <div className={styles.sidebarMenu}>
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className={activePath === item.path ? styles.active : ''}>
              {location ? (
                <Link to={item.path}>
                  <span className={styles.icon}>{item.icon}</span>
                  {!collapsed && <span className={styles.menuText}>{item.name}</span>}
                </Link>
              ) : (
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.path);
                  }}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  {!collapsed && <span className={styles.menuText}>{item.name}</span>}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.sidebarFooter}>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            <Users size={20} strokeWidth={1.5} />
          </div>
          {!collapsed && (
            <div className={styles.userInfo}>
              <p className={styles.userName}>Admin User</p>
              <p className={styles.userRole}>System Admin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
