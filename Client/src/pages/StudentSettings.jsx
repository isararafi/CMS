import React, { useState } from 'react';
import { User, Mail, Phone, Key, MapPin, Calendar, Edit2, Camera, Save, AlertCircle } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import styles from '../styles/pages/dashboard.module.scss';
import settingStyles from '../styles/pages/settings.module.scss';

const StudentSettings = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);

  // Mock data - would be fetched from API
  const [studentData, setStudentData] = useState({
    name: "John Smith",
    rollNo: "Fall 23-BSSE-123",
    email: "john.smith@university.edu",
    phone: "+1 (555) 123-4567",
    department: "Software Engineering",
    semester: "Fall 2023",
    dateOfBirth: "1998-05-15",
    address: "123 University Avenue, College Town, State - 10001",
    profilePicture: "https://randomuser.me/api/portraits/men/75.jpg",
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      resultsPublished: true,
      assignmentDeadlines: true,
      feeDueReminders: true,
      courseUpdates: true
    },
    privacySettings: {
      showEmail: false,
      showPhone: false,
      allowProfileView: true,
      showAcademicInfo: true
    },
    currentPassword: "password123", // This is just for demo purposes
    loginActivity: [
      { id: 1, device: "Windows 10 - Chrome", location: "New York, USA", time: "2023-11-15 14:30:45", status: "success" },
      { id: 2, device: "macOS - Safari", location: "New York, USA", time: "2023-11-12 09:15:22", status: "success" },
      { id: 3, device: "iOS - Mobile App", location: "Boston, USA", time: "2023-11-10 18:45:30", status: "success" },
      { id: 4, device: "Android - Mobile App", location: "Chicago, USA", time: "2023-11-05 07:20:15", status: "failed" }
    ]
  });

  const [formData, setFormData] = useState({
    name: studentData.name,
    email: studentData.email,
    phone: studentData.phone,
    address: studentData.address,
    dateOfBirth: studentData.dateOfBirth,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setStudentData({
        ...studentData,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth
      });
      showNotification('success', 'Profile updated successfully');
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (e, section) => {
    const { name, checked } = e.target;
    setStudentData({
      ...studentData,
      [section]: {
        ...studentData[section],
        [name]: checked
      }
    });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (formData.currentPassword !== studentData.currentPassword) {
      showNotification('error', 'Current password is incorrect');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      showNotification('error', 'New passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 8) {
      showNotification('error', 'Password must be at least 8 characters');
      return;
    }
    
    // Update password
    setStudentData({
      ...studentData,
      currentPassword: formData.newPassword
    });
    
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    
    showNotification('success', 'Password updated successfully');
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Format datetime for display
  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString();
  };

  return (
    <div className={styles.dashboardLayout}>
      {/* Decorative elements */}
      <div className={styles.decorativeWave}></div>
      <div className={styles.decorativeTriangle}></div>
      <div className={styles.decorativeCircle}></div>
      <div className={styles.decorativeDots}></div>
      <div className={styles.decorativeDiamond}></div>
      
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <div className={styles.contentWrapper}>
          <div className={styles.pageContent}>
            <div className={styles.dashboardHeader}>
              <div className={styles.welcomeSection}>
                <h1>Account Settings</h1>
                <p className={styles.subtitle}>Manage your profile and preferences</p>
              </div>
            </div>
            
            {notification && (
              <div className={`${settingStyles.notification} ${settingStyles[notification.type]}`}>
                {notification.type === 'error' ? (
                  <AlertCircle size={18} />
                ) : (
                  <div className={settingStyles.successIcon}>✓</div>
                )}
                <span>{notification.message}</span>
              </div>
            )}

            <div className={settingStyles.settingsContainer}>
              <div className={settingStyles.settingsTabs}>
                <div 
                  className={`${settingStyles.tab} ${activeTab === 'profile' ? settingStyles.active : ''}`}
                  onClick={() => handleTabChange('profile')}
                >
                  <User size={18} />
                  <span>Profile Information</span>
                </div>
                <div 
                  className={`${settingStyles.tab} ${activeTab === 'notifications' ? settingStyles.active : ''}`}
                  onClick={() => handleTabChange('notifications')}
                >
                  <Mail size={18} />
                  <span>Notification Settings</span>
                </div>
                <div 
                  className={`${settingStyles.tab} ${activeTab === 'privacy' ? settingStyles.active : ''}`}
                  onClick={() => handleTabChange('privacy')}
                >
                  <Key size={18} />
                  <span>Privacy & Security</span>
                </div>
                <div 
                  className={`${settingStyles.tab} ${activeTab === 'password' ? settingStyles.active : ''}`}
                  onClick={() => handleTabChange('password')}
                >
                  <Key size={18} />
                  <span>Change Password</span>
                </div>
                <div 
                  className={`${settingStyles.tab} ${activeTab === 'activity' ? settingStyles.active : ''}`}
                  onClick={() => handleTabChange('activity')}
                >
                  <Calendar size={18} />
                  <span>Login Activity</span>
                </div>
              </div>
              
              <div className={settingStyles.settingsContent}>
                {activeTab === 'profile' && (
                  <div className={settingStyles.profileSection}>
                    <div className={settingStyles.sectionHeader}>
                      <h2>Profile Information</h2>
                      <button 
                        className={`${settingStyles.editButton} ${isEditing ? settingStyles.saveButton : ''}`}
                        onClick={handleEditToggle}
                      >
                        {isEditing ? (
                          <>
                            <Save size={16} />
                            <span>Save</span>
                          </>
                        ) : (
                          <>
                            <Edit2 size={16} />
                            <span>Edit</span>
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div className={settingStyles.profileContent}>
                      <div className={settingStyles.profilePicture}>
                        <img 
                          src={studentData.profilePicture} 
                          alt={studentData.name} 
                        />
                        {isEditing && (
                          <div className={settingStyles.changePhoto}>
                            <Camera size={20} />
                          </div>
                        )}
                      </div>
                      
                      <div className={settingStyles.profileDetails}>
                        <div className={settingStyles.formGroup}>
                          <label>Full Name</label>
                          {isEditing ? (
                            <input 
                              type="text" 
                              name="name" 
                              value={formData.name} 
                              onChange={handleInputChange}
                            />
                          ) : (
                            <p>{studentData.name}</p>
                          )}
                        </div>
                        
                        <div className={settingStyles.formGroup}>
                          <label>Roll Number</label>
                          <p>{studentData.rollNo}</p>
                        </div>
                        
                        <div className={settingStyles.formGroup}>
                          <label>Department</label>
                          <p>{studentData.department}</p>
                        </div>
                        
                        <div className={settingStyles.formGroup}>
                          <label>Semester</label>
                          <p>{studentData.semester}</p>
                        </div>
                        
                        <div className={settingStyles.formGroup}>
                          <label>Email Address</label>
                          {isEditing ? (
                            <input 
                              type="email" 
                              name="email" 
                              value={formData.email} 
                              onChange={handleInputChange}
                            />
                          ) : (
                            <p>{studentData.email}</p>
                          )}
                        </div>
                        
                        <div className={settingStyles.formGroup}>
                          <label>Phone Number</label>
                          {isEditing ? (
                            <input 
                              type="tel" 
                              name="phone" 
                              value={formData.phone} 
                              onChange={handleInputChange}
                            />
                          ) : (
                            <p>{studentData.phone}</p>
                          )}
                        </div>
                        
                        <div className={settingStyles.formGroup}>
                          <label>Date of Birth</label>
                          {isEditing ? (
                            <input 
                              type="date" 
                              name="dateOfBirth" 
                              value={formData.dateOfBirth} 
                              onChange={handleInputChange}
                            />
                          ) : (
                            <p>{formatDate(studentData.dateOfBirth)}</p>
                          )}
                        </div>
                        
                        <div className={settingStyles.formGroup}>
                          <label>Address</label>
                          {isEditing ? (
                            <textarea 
                              name="address" 
                              value={formData.address} 
                              onChange={handleInputChange}
                              rows={3}
                            />
                          ) : (
                            <p>{studentData.address}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'notifications' && (
                  <div className={settingStyles.notificationsSection}>
                    <div className={settingStyles.sectionHeader}>
                      <h2>Notification Settings</h2>
                      <div className={settingStyles.sectionSubtitle}>
                        Manage how you receive notifications and alerts
                      </div>
                    </div>
                    
                    <div className={settingStyles.notificationOptions}>
                      <div className={settingStyles.optionCategory}>
                        <h3>Notification Channels</h3>
                        <div className={settingStyles.option}>
                          <label className={settingStyles.checkboxLabel}>
                            <input 
                              type="checkbox" 
                              name="emailAlerts" 
                              checked={studentData.notifications.emailAlerts} 
                              onChange={(e) => handleCheckboxChange(e, 'notifications')} 
                            />
                            <span className={settingStyles.checkbox}></span>
                            <div>
                              <strong>Email Notifications</strong>
                              <p>Receive notifications via email</p>
                            </div>
                          </label>
                        </div>
                        
                        <div className={settingStyles.option}>
                          <label className={settingStyles.checkboxLabel}>
                            <input 
                              type="checkbox" 
                              name="smsAlerts" 
                              checked={studentData.notifications.smsAlerts} 
                              onChange={(e) => handleCheckboxChange(e, 'notifications')} 
                            />
                            <span className={settingStyles.checkbox}></span>
                            <div>
                              <strong>SMS Alerts</strong>
                              <p>Receive important alerts via SMS</p>
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      <div className={settingStyles.optionCategory}>
                        <h3>Notification Types</h3>
                        <div className={settingStyles.option}>
                          <label className={settingStyles.checkboxLabel}>
                            <input 
                              type="checkbox" 
                              name="resultsPublished" 
                              checked={studentData.notifications.resultsPublished} 
                              onChange={(e) => handleCheckboxChange(e, 'notifications')} 
                            />
                            <span className={settingStyles.checkbox}></span>
                            <div>
                              <strong>Results Published</strong>
                              <p>When your exam or assignment results are published</p>
                            </div>
                          </label>
                        </div>
                        
                        <div className={settingStyles.option}>
                          <label className={settingStyles.checkboxLabel}>
                            <input 
                              type="checkbox" 
                              name="assignmentDeadlines" 
                              checked={studentData.notifications.assignmentDeadlines} 
                              onChange={(e) => handleCheckboxChange(e, 'notifications')} 
                            />
                            <span className={settingStyles.checkbox}></span>
                            <div>
                              <strong>Assignment Deadlines</strong>
                              <p>Reminders about upcoming assignment deadlines</p>
                            </div>
                          </label>
                        </div>
                        
                        <div className={settingStyles.option}>
                          <label className={settingStyles.checkboxLabel}>
                            <input 
                              type="checkbox" 
                              name="feeDueReminders" 
                              checked={studentData.notifications.feeDueReminders} 
                              onChange={(e) => handleCheckboxChange(e, 'notifications')} 
                            />
                            <span className={settingStyles.checkbox}></span>
                            <div>
                              <strong>Fee Due Reminders</strong>
                              <p>Reminders about upcoming fee payment deadlines</p>
                            </div>
                          </label>
                        </div>
                        
                        <div className={settingStyles.option}>
                          <label className={settingStyles.checkboxLabel}>
                            <input 
                              type="checkbox" 
                              name="courseUpdates" 
                              checked={studentData.notifications.courseUpdates} 
                              onChange={(e) => handleCheckboxChange(e, 'notifications')} 
                            />
                            <span className={settingStyles.checkbox}></span>
                            <div>
                              <strong>Course Updates</strong>
                              <p>Updates about course materials, schedule changes, etc.</p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className={settingStyles.saveArea}>
                      <button className={settingStyles.saveButton} onClick={() => showNotification('success', 'Notification settings saved')}>
                        <Save size={16} />
                        <span>Save Preferences</span>
                      </button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'privacy' && (
                  <div className={settingStyles.privacySection}>
                    <div className={settingStyles.sectionHeader}>
                      <h2>Privacy Settings</h2>
                      <div className={settingStyles.sectionSubtitle}>
                        Control what information is visible to others
                      </div>
                    </div>
                    
                    <div className={settingStyles.privacyOptions}>
                      <div className={settingStyles.option}>
                        <label className={settingStyles.checkboxLabel}>
                          <input 
                            type="checkbox" 
                            name="showEmail" 
                            checked={studentData.privacySettings.showEmail} 
                            onChange={(e) => handleCheckboxChange(e, 'privacySettings')} 
                          />
                          <span className={settingStyles.checkbox}></span>
                          <div>
                            <strong>Show Email Address</strong>
                            <p>Make your email address visible to other students</p>
                          </div>
                        </label>
                      </div>
                      
                      <div className={settingStyles.option}>
                        <label className={settingStyles.checkboxLabel}>
                          <input 
                            type="checkbox" 
                            name="showPhone" 
                            checked={studentData.privacySettings.showPhone} 
                            onChange={(e) => handleCheckboxChange(e, 'privacySettings')} 
                          />
                          <span className={settingStyles.checkbox}></span>
                          <div>
                            <strong>Show Phone Number</strong>
                            <p>Make your phone number visible to other students</p>
                          </div>
                        </label>
                      </div>
                      
                      <div className={settingStyles.option}>
                        <label className={settingStyles.checkboxLabel}>
                          <input 
                            type="checkbox" 
                            name="allowProfileView" 
                            checked={studentData.privacySettings.allowProfileView} 
                            onChange={(e) => handleCheckboxChange(e, 'privacySettings')} 
                          />
                          <span className={settingStyles.checkbox}></span>
                          <div>
                            <strong>Profile Visibility</strong>
                            <p>Allow other students to view your profile</p>
                          </div>
                        </label>
                      </div>
                      
                      <div className={settingStyles.option}>
                        <label className={settingStyles.checkboxLabel}>
                          <input 
                            type="checkbox" 
                            name="showAcademicInfo" 
                            checked={studentData.privacySettings.showAcademicInfo} 
                            onChange={(e) => handleCheckboxChange(e, 'privacySettings')} 
                          />
                          <span className={settingStyles.checkbox}></span>
                          <div>
                            <strong>Academic Information</strong>
                            <p>Make your academic information visible to other students</p>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    <div className={settingStyles.saveArea}>
                      <button className={settingStyles.saveButton} onClick={() => showNotification('success', 'Privacy settings saved')}>
                        <Save size={16} />
                        <span>Save Preferences</span>
                      </button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'password' && (
                  <div className={settingStyles.passwordSection}>
                    <div className={settingStyles.sectionHeader}>
                      <h2>Change Password</h2>
                      <div className={settingStyles.sectionSubtitle}>
                        Update your password to keep your account secure
                      </div>
                    </div>
                    
                    <form className={settingStyles.passwordForm} onSubmit={handlePasswordChange}>
                      <div className={settingStyles.formGroup}>
                        <label>Current Password</label>
                        <input 
                          type="password" 
                          name="currentPassword" 
                          value={formData.currentPassword} 
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className={settingStyles.formGroup}>
                        <label>New Password</label>
                        <input 
                          type="password" 
                          name="newPassword" 
                          value={formData.newPassword} 
                          onChange={handleInputChange}
                          required
                        />
                        <small>Password must be at least 8 characters long</small>
                      </div>
                      
                      <div className={settingStyles.formGroup}>
                        <label>Confirm New Password</label>
                        <input 
                          type="password" 
                          name="confirmPassword" 
                          value={formData.confirmPassword} 
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className={settingStyles.saveArea}>
                        <button type="submit" className={settingStyles.saveButton}>
                          <Key size={16} />
                          <span>Update Password</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {activeTab === 'activity' && (
                  <div className={settingStyles.activitySection}>
                    <div className={settingStyles.sectionHeader}>
                      <h2>Login Activity</h2>
                      <div className={settingStyles.sectionSubtitle}>
                        Recent login activity on your account
                      </div>
                    </div>
                    
                    <div className={settingStyles.activityList}>
                      {studentData.loginActivity.map(activity => (
                        <div 
                          key={activity.id} 
                          className={`${settingStyles.activityItem} ${activity.status === 'failed' ? settingStyles.failedLogin : ''}`}
                        >
                          <div className={settingStyles.activityIcon}>
                            {activity.status === 'success' ? (
                              <div className={settingStyles.successIcon}>✓</div>
                            ) : (
                              <div className={settingStyles.failedIcon}>✕</div>
                            )}
                          </div>
                          <div className={settingStyles.activityDetails}>
                            <div className={settingStyles.activityDevice}>{activity.device}</div>
                            <div className={settingStyles.activityMeta}>
                              <div className={settingStyles.activityLocation}>
                                <MapPin size={14} />
                                <span>{activity.location}</span>
                              </div>
                              <div className={settingStyles.activityTime}>
                                <Calendar size={14} />
                                <span>{formatDateTime(activity.time)}</span>
                              </div>
                            </div>
                          </div>
                          <div className={settingStyles.activityStatus}>
                            {activity.status === 'success' ? 'Successful' : 'Failed'}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className={settingStyles.securityTip}>
                      <AlertCircle size={18} />
                      <p>If you notice any suspicious activity, please change your password immediately and contact support.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSettings; 