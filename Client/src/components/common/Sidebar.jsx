import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  BookOpen,
  ClipboardList,
  Settings,
  CreditCard,
  CheckSquare,
  Menu,
  ChevronDown,
  GraduationCap,
  BookOpenCheck,
  BarChart2,
  PenTool,
  ListChecks,
  BookMarked
} from 'lucide-react';
import styles from '../../styles/components/sidebar.module.scss';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const [coursesSubmenuOpen, setCoursesSubmenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  const toggleCoursesSubmenu = () => {
    setCoursesSubmenuOpen(!coursesSubmenuOpen);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Light elements for the top section */}
      <div className={styles.topHighlight}></div>
      <div className={styles.lightCircle}></div>
      
      {/* Decorative elements */}
      <div className={styles.cutout}></div>
      <div className={styles.wave}></div>
      <div className={styles.diamond}></div>
      <div className={styles.circle}></div>
      <div className={styles.triangle}></div>
      <div className={styles.dots}></div>

      <div className={styles.sidebarHeader}>
        <div className={styles.logoContainer}>
          <img src="/logo.png" alt="Logo" className={styles.logo} />
          {!collapsed && <h1 className={styles.title}>CMS</h1>}
        </div>
        <button className={styles.toggleButton} onClick={toggleSidebar}>
          <Menu size={20} strokeWidth={1.5} />
        </button>
      </div>

      <div className={styles.sidebarMenu}>
        <ul>
          <li className={isActive('/dashboard') ? styles.active : ''}>
            <Link to="/student/dashboard">
              <span className={styles.icon}><Home size={20} strokeWidth={1.5} /></span>
              {!collapsed && <span className={styles.menuText}>Dashboard</span>}
            </Link>
          </li>

          <li className={`${styles.hasSubmenu} ${isActive('/courses') ? styles.active : ''}`}>
            <div className={styles.menuItem} onClick={toggleCoursesSubmenu}>
              <span className={styles.icon}><BookOpen size={20} strokeWidth={1.5} /></span>
              {!collapsed && (
                <>
                  <span className={styles.menuText}>Courses</span>
                  <ChevronDown 
                    size={16} 
                    strokeWidth={1.5} 
                    className={`${styles.arrow} ${coursesSubmenuOpen ? styles.expanded : ''}`} 
                  />
                </>
              )}
            </div>
            {!collapsed && (
              <ul className={`${styles.submenu} ${coursesSubmenuOpen ? styles.visible : ''}`}>
                <li className={isActive('/courses/mids') ? styles.active : ''}>
                  <Link to="/student/courses/mids">
                    <span className={styles.icon}><CheckSquare size={18} strokeWidth={1.5} /></span>
                    <span className={styles.menuText}>Marks</span>
                  </Link>
                </li>
                <li className={isActive('/courses/summary') ? styles.active : ''}>
                  <Link to="/student/courses/summary">
                    <span className={styles.icon}><BarChart2 size={18} strokeWidth={1.5} /></span>
                    <span className={styles.menuText}>Summary</span>
                  </Link>
                </li>
                <li className={isActive('/courses/proceedings') ? styles.active : ''}>
                  <Link to="/student/courses/proceedings">
                    <span className={styles.icon}><PenTool size={18} strokeWidth={1.5} /></span>
                    <span className={styles.menuText}>Class Proceedings</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li className={isActive('/registration') ? styles.active : ''}>
            <Link to="/student/registration">
              <span className={styles.icon}><BookOpenCheck size={20} strokeWidth={1.5} /></span>
              {!collapsed && <span className={styles.menuText}>Registration</span>}
            </Link>
          </li>

          <li className={isActive('/result') ? styles.active : ''}>
            <Link to="/student/result">
              <span className={styles.icon}><GraduationCap size={20} strokeWidth={1.5} /></span>
              {!collapsed && <span className={styles.menuText}>Result</span>}
            </Link>
          </li>

          <li className={isActive('/fees') ? styles.active : ''}>
            <Link to="/student/fees">
              <span className={styles.icon}><CreditCard size={20} strokeWidth={1.5} /></span>
              {!collapsed && <span className={styles.menuText}>Fees</span>}
            </Link>
          </li>

          <li className={isActive('/assignments') ? styles.active : ''}>
            <Link to="/student/assignments">
              <span className={styles.icon}><ClipboardList size={20} strokeWidth={1.5} /></span>
              {!collapsed && <span className={styles.menuText}>Assignments</span>}
            </Link>
          </li>

          <li className={isActive('/settings') ? styles.active : ''}>
            <Link to="/student/settings">
              <span className={styles.icon}><Settings size={20} strokeWidth={1.5} /></span>
              {!collapsed && <span className={styles.menuText}>Settings</span>}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
