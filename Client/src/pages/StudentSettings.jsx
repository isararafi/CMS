import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Key, MapPin, Calendar, Edit2, Camera, Save, AlertCircle } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import styles from '../styles/pages/studentSettings.module.scss';
import settingStyles from '../styles/pages/settings.module.scss';
import { fetchStudentProfile, updateStudentProfile } from '../features/student/studentSettingsSlice';

const StudentSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, isLoading, error, successMessage } = useSelector(state => state.studentSettings);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchStudentProfile());
  }, [dispatch]);

  useEffect(() => {
    // Update form when profile changes
    if (profile) {
      setForm({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
    }
  }, [profile]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsEditing(false);
  };

  const handleEdit = async () => {
    if (isEditing) {
      try {
        await dispatch(updateStudentProfile(form)).unwrap();
        setIsEditing(false);
      } catch (err) {
        console.error('Failed to submit profile update request:', err);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(";").forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
    
    // Navigate to home page
    navigate('/');
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

  // Show loading state
  if (isLoading) {
    return (
      <div className={styles.settingsPage}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.settingsPage}>
        <div className={styles.error}>
          Error loading profile: {error}
        </div>
      </div>
    );
  }

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
                        onClick={handleEdit}
                      >
                        {isEditing ? (
                          <>
                            <Save size={16} />
                            <span>Submit Request</span>
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
                          src={profile?.profilePicture || "https://randomuser.me/api/portraits/men/75.jpg"} 
                          alt={profile?.name || "John Smith"} 
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
                              value={form.name} 
                              onChange={handleChange}
                              className={styles.input}
                            />
                          ) : (
                            <p>{profile?.name || "John Smith"}</p>
                          )}
                        </div>
                        
                        <div className={settingStyles.formGroup}>
                          <label>Roll Number</label>
                          <p>{profile?.rollNo || "Fall 23-BSSE-123"}</p>
                        </div>
                        
                        <div className={settingStyles.formGroup}>
                          <label>Department</label>
                          <p>{profile?.department || "Software Engineering"}</p>
                        </div>
                        
                        <div className={settingStyles.formGroup}>
                          <label>Semester</label>
                          <p>{profile?.semester || "Fall 2023"}</p>
                        </div>
                        
                        <div className={settingStyles.formGroup}>
                          <label>Email Address</label>
                          {isEditing ? (
                            <input 
                              type="email" 
                              name="email" 
                              value={form.email} 
                              onChange={handleChange}
                              className={styles.input}
                            />
                          ) : (
                            <p>{profile?.email || "john.smith@university.edu"}</p>
                          )}
                        </div>
                        
                        <div className={settingStyles.formGroup}>
                          <label>Phone Number</label>
                          {isEditing ? (
                            <input 
                              type="tel" 
                              name="phone" 
                              value={form.phone} 
                              onChange={handleChange}
                              className={styles.input}
                            />
                          ) : (
                            <p>{profile?.phone || "+1 (555) 123-4567"}</p>
                          )}
                        </div>
                        
                        <div className={settingStyles.formGroup}>
                          <label>Date of Birth</label>
                          {isEditing ? (
                            <input 
                              type="date" 
                              name="dateOfBirth" 
                              value={profile?.dateOfBirth || "1998-05-15"} 
                              onChange={handleChange}
                              className={styles.input}
                            />
                          ) : (
                            <p>{formatDate(profile?.dateOfBirth || "1998-05-15")}</p>
                          )}
                        </div>
                        
                        <div className={settingStyles.formGroup}>
                          <label>Address</label>
                          {isEditing ? (
                            <input 
                              name="address" 
                              value={form.address} 
                              onChange={handleChange}
                              className={styles.input}
                            />
                          ) : (
                            <p>{profile?.address || "123 University Avenue, College Town, State - 10001"}</p>
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
                              checked={profile?.notifications.emailAlerts || false} 
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  notifications: {
                                    ...profile?.notifications,
                                    emailAlerts: e.target.checked
                                  }
                                });
                              }} 
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
                              checked={profile?.notifications.smsAlerts || false} 
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  notifications: {
                                    ...profile?.notifications,
                                    smsAlerts: e.target.checked
                                  }
                                });
                              }} 
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
                              checked={profile?.notifications.resultsPublished || false} 
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  notifications: {
                                    ...profile?.notifications,
                                    resultsPublished: e.target.checked
                                  }
                                });
                              }} 
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
                              checked={profile?.notifications.assignmentDeadlines || false} 
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  notifications: {
                                    ...profile?.notifications,
                                    assignmentDeadlines: e.target.checked
                                  }
                                });
                              }} 
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
                              checked={profile?.notifications.feeDueReminders || false} 
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  notifications: {
                                    ...profile?.notifications,
                                    feeDueReminders: e.target.checked
                                  }
                                });
                              }} 
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
                              checked={profile?.notifications.courseUpdates || false} 
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  notifications: {
                                    ...profile?.notifications,
                                    courseUpdates: e.target.checked
                                  }
                                });
                              }} 
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
                            checked={profile?.privacySettings.showEmail || false} 
                            onChange={(e) => {
                              setForm({
                                ...form,
                                privacySettings: {
                                  ...profile?.privacySettings,
                                  showEmail: e.target.checked
                                }
                              });
                            }} 
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
                            checked={profile?.privacySettings.showPhone || false} 
                            onChange={(e) => {
                              setForm({
                                ...form,
                                privacySettings: {
                                  ...profile?.privacySettings,
                                  showPhone: e.target.checked
                                }
                              });
                            }} 
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
                            checked={profile?.privacySettings.allowProfileView || false} 
                            onChange={(e) => {
                              setForm({
                                ...form,
                                privacySettings: {
                                  ...profile?.privacySettings,
                                  allowProfileView: e.target.checked
                                }
                              });
                            }} 
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
                            checked={profile?.privacySettings.showAcademicInfo || false} 
                            onChange={(e) => {
                              setForm({
                                ...form,
                                privacySettings: {
                                  ...profile?.privacySettings,
                                  showAcademicInfo: e.target.checked
                                }
                              });
                            }} 
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
                    
                    <form className={settingStyles.passwordForm} onSubmit={(e) => {
                      e.preventDefault();
                      showNotification('error', 'Password change functionality not implemented');
                    }}>
                      <div className={settingStyles.formGroup}>
                        <label>Current Password</label>
                        <input 
                          type="password" 
                          name="currentPassword" 
                          value={profile?.currentPassword || ''} 
                          onChange={(e) => {
                            setForm({
                              ...form,
                              currentPassword: e.target.value
                            });
                          }}
                          required
                        />
                      </div>
                      
                      <div className={settingStyles.formGroup}>
                        <label>New Password</label>
                        <input 
                          type="password" 
                          name="newPassword" 
                          value={profile?.newPassword || ''} 
                          onChange={(e) => {
                            setForm({
                              ...form,
                              newPassword: e.target.value
                            });
                          }}
                          required
                        />
                        <small>Password must be at least 8 characters long</small>
                      </div>
                      
                      <div className={settingStyles.formGroup}>
                        <label>Confirm New Password</label>
                        <input 
                          type="password" 
                          name="confirmPassword" 
                          value={profile?.confirmPassword || ''} 
                          onChange={(e) => {
                            setForm({
                              ...form,
                              confirmPassword: e.target.value
                            });
                          }}
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
                      {profile?.loginActivity.map(activity => (
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