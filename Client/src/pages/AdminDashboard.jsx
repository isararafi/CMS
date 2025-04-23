import React, { useState } from 'react';
import { Users, BookOpen, Bell, Settings, BarChart2, Building, Clipboard, UserCheck } from 'lucide-react';
import styles from '../styles/pages/dashboard.module.scss';

const AdminDashboard = () => {
  // Mock data - would be fetched from API in real application
  const adminData = {
    name: "Sarah Peterson",
    position: "System Administrator",
    email: "sarah.peterson@university.edu",
    department: "IT Department",
    stats: {
      students: 1245,
      faculty: 87,
      courses: 125,
      departments: 12
    },
    recentActivity: [
      { id: 1, action: "New Student Registration", date: "2023-05-15", user: "Admin", details: "20 new students were registered for Fall 2023" },
      { id: 2, action: "Course Schedule Updated", date: "2023-05-14", user: "Dr. Johnson", details: "Updated schedule for CSE101 to Mon/Wed instead of Tue/Thu" },
      { id: 3, action: "System Maintenance", date: "2023-05-12", user: "System", details: "Automatic backup completed successfully" },
      { id: 4, action: "New Faculty Onboarded", date: "2023-05-10", user: "Admin", details: "Dr. Lisa Chen added to Computer Science department" }
    ],
    pendingApprovals: [
      { id: 1, type: "Course Creation", title: "Mobile App Development", requestedBy: "Dr. James Wilson", department: "Computer Science", date: "2023-05-14" },
      { id: 2, type: "Room Change", title: "Discrete Mathematics", requestedBy: "Dr. Sarah Miller", department: "Mathematics", date: "2023-05-13" },
      { id: 3, type: "Special Permission", title: "Advanced Research Methods", requestedBy: "Student: John Doe", department: "Psychology", date: "2023-05-12" }
    ],
    systemAlerts: [
      { id: 1, level: "warning", message: "Server load high during registration period", date: "2023-05-15" },
      { id: 2, level: "info", message: "System update scheduled for May 20, 2023", date: "2023-05-14" },
      { id: 3, level: "error", message: "Database backup failed on secondary server", date: "2023-05-13" }
    ],
    departments: [
      { id: 1, name: "Computer Science", faculty: 14, students: 220, courses: 28 },
      { id: 2, name: "Electrical Engineering", faculty: 12, students: 185, courses: 24 },
      { id: 3, name: "Business Administration", faculty: 18, students: 310, courses: 32 },
      { id: 4, name: "Mathematics", faculty: 10, students: 150, courses: 22 }
    ]
  };

  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <div className={styles.welcomeSection}>
          <h1>Welcome, {adminData.name}</h1>
          <p className={styles.subtitle}>Admin Dashboard • {adminData.department}</p>
        </div>
        <div className={styles.adminInfo}>
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

      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
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
          {activeTab === 'overview' && (
            <div className={styles.overviewContainer}>
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

              <div className={styles.columnRight}>
                <div className={styles.widgetCard}>
                  <div className={styles.widgetHeader}>
                    <h2 className={styles.widgetTitle}>Pending Approvals</h2>
                  </div>
                  <div className={styles.approvalsList}>
                    {adminData.pendingApprovals.map(approval => (
                      <div key={approval.id} className={styles.approvalItem}>
                        <div className={styles.approvalHeader}>
                          <span className={styles.approvalType}>{approval.type}</span>
                          <span className={styles.approvalDate}>{new Date(approval.date).toLocaleDateString()}</span>
                        </div>
                        <h4 className={styles.approvalTitle}>{approval.title}</h4>
                        <div className={styles.approvalDetails}>
                          <p>{approval.requestedBy}</p>
                          <p>{approval.department}</p>
                        </div>
                        <div className={styles.approvalActions}>
                          <button className={styles.approveButton}>Approve</button>
                          <button className={styles.rejectButton}>Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.widgetCard}>
                  <div className={styles.widgetHeader}>
                    <h2 className={styles.widgetTitle}>Quick Actions</h2>
                  </div>
                  <div className={styles.quickActions}>
                    <button className={styles.actionButton}>
                      <Users size={18} />
                      <span>Add New User</span>
                    </button>
                    <button className={styles.actionButton}>
                      <BookOpen size={18} />
                      <span>Create Course</span>
                    </button>
                    <button className={styles.actionButton}>
                      <Clipboard size={18} />
                      <span>Generate Reports</span>
                    </button>
                    <button className={styles.actionButton}>
                      <Settings size={18} />
                      <span>System Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className={styles.usersContainer}>
              <div className={styles.managementHeader}>
                <div className={styles.searchAndFilters}>
                  <div className={styles.searchBox}>
                    <input type="text" placeholder="Search users..." className={styles.searchInput} />
                    <button className={styles.searchButton}>Search</button>
                  </div>
                  <div className={styles.filterGroup}>
                    <select className={styles.filterSelect}>
                      <option>All Roles</option>
                      <option>Students</option>
                      <option>Faculty</option>
                      <option>Administrators</option>
                    </select>
                    <select className={styles.filterSelect}>
                      <option>All Departments</option>
                      {adminData.departments.map(dept => (
                        <option key={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                    <button className={styles.addButton}>Add New User</button>
                  </div>
                </div>
              </div>

              <div className={styles.usersTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableHeaderCell}>Name</div>
                  <div className={styles.tableHeaderCell}>Email</div>
                  <div className={styles.tableHeaderCell}>Role</div>
                  <div className={styles.tableHeaderCell}>Department</div>
                  <div className={styles.tableHeaderCell}>Status</div>
                  <div className={styles.tableHeaderCell}>Actions</div>
                </div>
                
                <div className={styles.tableRow}>
                  <div className={styles.tableCell}>John Smith</div>
                  <div className={styles.tableCell}>john.smith@university.edu</div>
                  <div className={styles.tableCell}>Student</div>
                  <div className={styles.tableCell}>Computer Science</div>
                  <div className={styles.tableCell}>
                    <span className={styles.statusActive}>Active</span>
                  </div>
                  <div className={styles.tableCell}>
                    <div className={styles.actionButtons}>
                      <button className={styles.actionButton}>Edit</button>
                      <button className={styles.actionButton}>Suspend</button>
                    </div>
                  </div>
                </div>
                
                <div className={styles.tableRow}>
                  <div className={styles.tableCell}>Emily Johnson</div>
                  <div className={styles.tableCell}>emily.johnson@university.edu</div>
                  <div className={styles.tableCell}>Faculty</div>
                  <div className={styles.tableCell}>Computer Science</div>
                  <div className={styles.tableCell}>
                    <span className={styles.statusActive}>Active</span>
                  </div>
                  <div className={styles.tableCell}>
                    <div className={styles.actionButtons}>
                      <button className={styles.actionButton}>Edit</button>
                      <button className={styles.actionButton}>Suspend</button>
                    </div>
                  </div>
                </div>
                
                <div className={styles.tableRow}>
                  <div className={styles.tableCell}>Michael Brown</div>
                  <div className={styles.tableCell}>michael.brown@university.edu</div>
                  <div className={styles.tableCell}>Student</div>
                  <div className={styles.tableCell}>Business Administration</div>
                  <div className={styles.tableCell}>
                    <span className={styles.statusInactive}>Inactive</span>
                  </div>
                  <div className={styles.tableCell}>
                    <div className={styles.actionButtons}>
                      <button className={styles.actionButton}>Edit</button>
                      <button className={styles.actionButton}>Activate</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'departments' && (
            <div className={styles.departmentsContainer}>
              <div className={styles.managementHeader}>
                <div className={styles.searchAndFilters}>
                  <div className={styles.searchBox}>
                    <input type="text" placeholder="Search departments..." className={styles.searchInput} />
                    <button className={styles.searchButton}>Search</button>
                  </div>
                  <button className={styles.addButton}>Add Department</button>
                </div>
              </div>
              
              <div className={styles.departmentsGrid}>
                {adminData.departments.map(department => (
                  <div key={department.id} className={styles.departmentCard}>
                    <h3 className={styles.departmentName}>{department.name}</h3>
                    <div className={styles.departmentStats}>
                      <div className={styles.departmentStat}>
                        <span className={styles.statIcon}><Users size={16} /></span>
                        <span className={styles.statLabel}>Students:</span>
                        <span className={styles.statValue}>{department.students}</span>
                      </div>
                      <div className={styles.departmentStat}>
                        <span className={styles.statIcon}><UserCheck size={16} /></span>
                        <span className={styles.statLabel}>Faculty:</span>
                        <span className={styles.statValue}>{department.faculty}</span>
                      </div>
                      <div className={styles.departmentStat}>
                        <span className={styles.statIcon}><BookOpen size={16} /></span>
                        <span className={styles.statLabel}>Courses:</span>
                        <span className={styles.statValue}>{department.courses}</span>
                      </div>
                    </div>
                    <div className={styles.departmentActions}>
                      <button className={styles.actionButton}>View Details</button>
                      <button className={styles.actionButton}>Manage</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 