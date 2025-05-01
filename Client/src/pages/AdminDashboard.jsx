import React, { useState } from 'react'; // Import React and useState hook
import { Users, BookOpen, Bell, Settings, BarChart2, Building, Clipboard, UserCheck } from 'lucide-react'; // Import icons
import styles from '../styles/pages/dashboard.module.scss'; // Import styles






/*In short, the $ is used in template literals to 
embed expressions inside a string. This allows you to dynamically construct a string, 
such as dynamically adding or removing class names based on conditions.*/

const AdminDashboard = () => {
  // Mock data - would be fetched from API in a real application
  const adminData = {
    name: "Sarah Peterson", // Admin name
    position: "System Administrator", // Admin position
    email: "sarah.peterson@university.edu", // Admin email
    department: "IT Department", // Admin department
    stats: {
      students: 1245, // Total students
      faculty: 87, // Total faculty members
      courses: 125, // Total courses
      departments: 12 // Total departments
    },
    recentActivity: [ // List of recent activities
      { id: 1, action: "New Student Registration", date: "2023-05-15", user: "Admin", details: "20 new students were registered for Fall 2023" },
      { id: 2, action: "Course Schedule Updated", date: "2023-05-14", user: "Dr. Johnson", details: "Updated schedule for CSE101 to Mon/Wed instead of Tue/Thu" },
      { id: 3, action: "System Maintenance", date: "2023-05-12", user: "System", details: "Automatic backup completed successfully" },
      { id: 4, action: "New Faculty Onboarded", date: "2023-05-10", user: "Admin", details: "Dr. Lisa Chen added to Computer Science department" }
    ],
    pendingApprovals: [ // List of pending approvals
      { id: 1, type: "Course Creation", title: "Mobile App Development", requestedBy: "Dr. James Wilson", department: "Computer Science", date: "2023-05-14" },
      { id: 2, type: "Room Change", title: "Discrete Mathematics", requestedBy: "Dr. Sarah Miller", department: "Mathematics", date: "2023-05-13" },
      { id: 3, type: "Special Permission", title: "Advanced Research Methods", requestedBy: "Student: John Doe", department: "Psychology", date: "2023-05-12" }
    ],
    systemAlerts: [ // List of system alerts
      { id: 1, level: "warning", message: "Server load high during registration period", date: "2023-05-15" },
      { id: 2, level: "info", message: "System update scheduled for May 20, 2023", date: "2023-05-14" },
      { id: 3, level: "error", message: "Database backup failed on secondary server", date: "2023-05-13" }
    ],
    departments: [ // List of departments
      { id: 1, name: "Computer Science", faculty: 14, students: 220, courses: 28 },
      { id: 2, name: "Electrical Engineering", faculty: 12, students: 185, courses: 24 },
      { id: 3, name: "Business Administration", faculty: 18, students: 310, courses: 32 },
      { id: 4, name: "Mathematics", faculty: 10, students: 150, courses: 22 }
    ]
  };

  // State for active tab (default is 'overview')
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={styles.dashboardContainer}> {/* Dashboard container */}
      <div className={styles.dashboardHeader}>
        {/* Header section with admin info */}
        <div className={styles.welcomeSection}>
          <h1>Welcome, {adminData.name}</h1>
          <p className={styles.subtitle}>Admin Dashboard • {adminData.department}</p>
        </div>
        <div className={styles.adminInfo}>
          {/* Display admin position and email */}
          <div className={styles.infoItem}>
            <span className={styles.label}>Position:</span>
            <span className={styles.value}>{adminData.position}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{adminData.email}</span>
          </div>
        </div>
      </div>

      <div className={styles.statsContainer}>
        {/* Stats section with cards for students, faculty, courses, and departments */}
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Users size={24} /></div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{adminData.stats.students}</h3>
            <p className={styles.statLabel}>Total Students</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><UserCheck size={24} /></div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{adminData.stats.faculty}</h3>
            <p className={styles.statLabel}>Faculty Members</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><BookOpen size={24} /></div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{adminData.stats.courses}</h3>
            <p className={styles.statLabel}>Active Courses</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Building size={24} /></div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{adminData.stats.departments}</h3>
            <p className={styles.statLabel}>Departments</p>
          </div>
        </div>
      </div>

      {/* Tab section for different views */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          {/* Buttons to switch between different tabs */}
          <button 
            className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'users' ? styles.active : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'departments' ? styles.active : ''}`}
            onClick={() => setActiveTab('departments')}
          >
            Departments
          </button>
        </div>

        <div className={styles.tabContent}>
          {/* Overview tab content */}
          {activeTab === 'overview' && (
            <div className={styles.overviewContainer}>
              {/* Left column with recent activities and system alerts */}
              <div className={styles.columnLeft}>
                <div className={styles.widgetCard}>
                  <div className={styles.widgetHeader}>
                    <h2 className={styles.widgetTitle}>Recent Activity</h2>
                  </div>
                  <div className={styles.activityList}>
                    {adminData.recentActivity.map(activity => (
                      <div key={activity.id} className={styles.activityItem}>
                        <div className={styles.activityContent}>
                          <h4 className={styles.activityTitle}>{activity.action}</h4>
                          <p className={styles.activityDetails}>{activity.details}</p>
                        </div>
                        <div className={styles.activityMeta}>
                          <span className={styles.activityUser}>{activity.user}</span>
                          <span className={styles.activityDate}>{new Date(activity.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.widgetCard}>
                  <div className={styles.widgetHeader}>
                    <h2 className={styles.widgetTitle}>System Alerts</h2>
                  </div>
                  <div className={styles.alertsList}>
                    {adminData.systemAlerts.map(alert => (
                      <div key={alert.id} className={`${styles.alertItem} ${styles[alert.level]}`}>
                        <div className={styles.alertIcon}>
                          {alert.level === 'error' && <Bell size={18} />}
                          {alert.level === 'warning' && <Bell size={18} />}
                          {alert.level === 'info' && <Bell size={18} />}
                        </div>
                        <div className={styles.alertContent}>
                          <p className={styles.alertMessage}>{alert.message}</p>
                          <span className={styles.alertDate}>{new Date(alert.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column with pending approvals and quick actions */}
              <div className={styles.columnRight}>
                <div className={styles.widgetCard}>
                  <div className={styles.widgetHeader}>
                    <h2 className={styles.widgetTitle}>Pending Approvals</h2>
                  </div>
                  <div className={styles.pendingApprovals}>
                    {adminData.pendingApprovals.map(approval => (
                      <div key={approval.id} className={styles.approvalItem}>
                        <div className={styles.approvalDetails}>
                          <h4 className={styles.approvalTitle}>{approval.title}</h4>
                          <p className={styles.approvalType}>{approval.type}</p>
                        </div>
                        <div className={styles.approvalMeta}>
                          <span className={styles.approvalRequestedBy}>{approval.requestedBy}</span>
                          <span className={styles.approvalDate}>{new Date(approval.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.widgetCard}>
                  <div className={styles.widgetHeader}>
                    <h2 className={styles.widgetTitle}>Departments Overview</h2>
                  </div>
                  <div className={styles.departmentsList}>
                    {adminData.departments.map(department => (
                      <div key={department.id} className={styles.departmentItem}>
                        <h4 className={styles.departmentName}>{department.name}</h4>
                        <p className={styles.departmentStats}>
                          Faculty: {department.faculty} | Students: {department.students} | Courses: {department.courses}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
