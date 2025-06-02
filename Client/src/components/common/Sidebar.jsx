import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.avif';
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
  User,
  Users,
  UserPlus,
  UserCheck,
  LogOut
} from 'lucide-react';
import styles from '../../styles/components/sidebar.module.scss';

const Sidebar = ({ collapsed, setCollapsed, role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [coursesSubmenuOpen, setCoursesSubmenuOpen] = useState(false);
  const [studentSubmenuOpen, setStudentSubmenuOpen] = useState(false);
  const [teacherSubmenuOpen, setTeacherSubmenuOpen] = useState(false);

  // Check if the current route is active
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  // Automatically manage the courses submenu state based on the current route
  useEffect(() => {
    if (location.pathname.includes('/student/courses')) {
      setCoursesSubmenuOpen(true);
    } else {
      setCoursesSubmenuOpen(false);
    }
  }, [location.pathname]);

  // Toggle submenu only when clicking the parent "Courses" menu item
  const toggleCoursesSubmenu = (e) => {
    // Only toggle if the click is on the parent menu item (not a submenu link)
    if (e.target.closest('.submenu') === null) {
      if (collapsed) {
        setCollapsed(false); // Expand sidebar if collapsed
        setCoursesSubmenuOpen(true); // Open submenu
      } else {
        setCoursesSubmenuOpen(!coursesSubmenuOpen);
      }
    }
  };

  const toggleStudentSubmenu = () => {
    setStudentSubmenuOpen(!studentSubmenuOpen);
  };

  const toggleTeacherSubmenu = () => {
    setTeacherSubmenuOpen(!teacherSubmenuOpen);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.clear(); // Clear all localStorage data
    navigate('/'); // Redirect to home page
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
          <img src={logo} alt="Logo" className={styles.logo} />
          {!collapsed && <h1 className={styles.title}>CMS</h1>}
          {collapsed && (
            <button
              className={`${styles.toggleButton} ${styles.toggleOverLogo}`}
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
          )}
        </div>
        {!collapsed && (
          <button className={styles.toggleButton} onClick={toggleSidebar}>
            <Menu size={20} strokeWidth={1.5} />
          </button>
        )}
      </div>

      <div className={styles.sidebarMenu}>
        <ul>
          {(role === 'student' || !role) && (
            <>
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
                     <span className={styles.menuText}>&nbsp;&nbsp;&nbsp;&nbsp;Courses</span>

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
                  </ul>  
                )}
              </li>
              <li className={isActive('/registration') ? styles.active : ''}>
                <Link to="/student/registration">
                  <span className={styles.icon}><BookOpenCheck size={20} strokeWidth={1.5} /></span>
                  {!collapsed && <span className={styles.menuText}>Registration</span>}
                </Link>
              </li>
              {/* <li className={isActive('/result') ? styles.active : ''}>
                <Link to="/student/result">
                  <span className={styles.icon}><GraduationCap size={20} strokeWidth={1.5} /></span>
                  {!collapsed && <span className={styles.menuText}>Result</span>}
                </Link>
              </li> */}
              {/* <li className={isActive('/fees') ? styles.active : ''}>
                <Link to="/student/fees">
                  <span className={styles.icon}><CreditCard size={20} strokeWidth={1.5} /></span>
                  {!collapsed && <span className={styles.menuText}>Fees</span>}
                </Link>
              </li> */}
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
            </>
          )}
          {role === 'tutor' && (
            <>
              <li className={isActive('/teacher/attendance') ? styles.active : ''}>
                <Link to="/teacher/attendance">
                  <span className={styles.icon}><ClipboardList size={20} strokeWidth={1.5} /></span>
                  {!collapsed && <span className={styles.menuText}>Attendance</span>}
                </Link>
              </li>
              <li className={isActive('/teacher/marks') ? styles.active : ''}>
                <Link to="/teacher/marks">
                  <span className={styles.icon}><CheckSquare size={20} strokeWidth={1.5} /></span>
                  {!collapsed && <span className={styles.menuText}>Marks</span>}
                </Link>
              </li>
              <li className={isActive('/teacher/assignments') ? styles.active : ''}>
                <Link to="/teacher/assignments">
                  <span className={styles.icon}><PenTool size={20} strokeWidth={1.5} /></span>
                  {!collapsed && <span className={styles.menuText}>Assignments</span>}
                </Link>
              </li>
              <li className={isActive('/teacher/settings') ? styles.active : ''}>
                <Link to="/teacher/settings">
                  <span className={styles.icon}><Settings size={20} strokeWidth={1.5} /></span>
                  {!collapsed && <span className={styles.menuText}>Settings</span>}
                </Link>
              </li>
            </>
          )}
          {role === 'admin' && (
            <>
              <li className={`${styles.hasSubmenu} ${isActive('/admin/student') ? styles.active : ''}`}>
                <div className={styles.menuItem} onClick={toggleStudentSubmenu}>
                  <span className={styles.icon} style={{ marginRight: '1rem' }}><User size={20} strokeWidth={1.5} /></span>
                  {!collapsed && (
                    <>
                      <span className={styles.menuText} style={{ marginRight: '0.5rem' }}>Student</span>
                      <ChevronDown size={16} strokeWidth={1.5} className={`${styles.arrow} ${studentSubmenuOpen ? styles.expanded : ''}`} />
                    </>
                  )}
                </div>
                {!collapsed && (
                  <ul className={`${styles.submenu} ${studentSubmenuOpen ? styles.visible : ''}`}>
                    <li>
                      <Link to="/admin/student/create" className={styles.menuButton} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <UserPlus size={16} style={{ marginRight: 8 }} />
                        Create
                      </Link>
                    </li>
                    <li className={isActive('/admin/student/display') ? styles.active : ''}>
                      <Link to="/admin/student/display" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Users size={16} style={{ marginRight: 8 }} />
                         All Students
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className={`${styles.hasSubmenu} ${isActive('/admin/teacher') ? styles.active : ''}`}>
                <div className={styles.menuItem} onClick={toggleTeacherSubmenu}>
                  <span className={styles.icon} style={{ marginRight: '1rem' }}><Users size={20} strokeWidth={1.5} /></span>
                  {!collapsed && (
                    <>
                      <span className={styles.menuText} style={{ marginRight: '0.5rem' }}>Teacher</span>
                      <ChevronDown size={16} strokeWidth={1.5} className={`${styles.arrow} ${teacherSubmenuOpen ? styles.expanded : ''}`} />
                    </>
                  )}
                </div>
                {!collapsed && (
                  <ul className={`${styles.submenu} ${teacherSubmenuOpen ? styles.visible : ''}`}>
                    <li>
                      <Link to="/admin/teacher/create" className={styles.menuButton} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <UserPlus size={16} style={{ marginRight: 8 }} />
                        Create
                      </Link>
                    </li>
                    <li className={isActive('/admin/teacher/display') ? styles.active : ''}>
                      <Link to="/admin/teacher/display" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <UserCheck size={16} style={{ marginRight: 8 }} />
                         All Teachers
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </>
          )}
          {/* Logout button at the bottom */}
          <li className={styles.logoutItem}>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <span className={styles.icon}><LogOut size={20} strokeWidth={1.5} /></span>
              {!collapsed && <span className={styles.menuText}>Logout</span>}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;