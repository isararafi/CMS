import React, { useState } from 'react';
import { User, Mail, Phone, Key, MapPin, Calendar, Edit2, Camera, Save, AlertCircle } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import styles from '../styles/pages/studentSettings.module.scss';
import settingStyles from '../styles/pages/settings.module.scss';

const StudentSettings = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);

  const [profile, setProfile] = useState({
    name: 'Muhammad Shahzeb',
    email: 'muhammadshahzeb2782@gmail.com',
    phone: '+92 330 0002782',
    address: '123 University Avenue, College Town',
    rollNo: 'Fall 23-BSSE-123',
    department: 'Software Engineering',
    semester: 'Fall 2023',
    dateOfBirth: '2003-01-23',
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      resultsPublished: true,
      assignmentDeadlines: false,
      feeDueReminders: true,
      courseUpdates: true
    },
    privacySettings: {
      showEmail: true,
      showPhone: true,
      allowProfileView: true,
      showAcademicInfo: true
    },
    loginActivity: [
      { id: 1, device: 'Chrome on Windows', location: 'Rawalpindi, PK', time: '2026-02-22T10:30:00', status: 'success' },
      { id: 2, device: 'Firefox on Mac', location: 'Islamabad, PK', time: '2026-02-21T14:45:00', status: 'failed' }
    ]
  });

  const [form, setForm] = useState({ ...profile });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (isEditing) {
      setProfile({ ...form });
      showNotification('success', 'Profile updated successfully');
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  const formatDateTime = (dateTimeString) => new Date(dateTimeString).toLocaleString();

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
                            <span>Submit</span>
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
                            <p>{profile.name}</p>
                          )}
                        </div>

                        <div className={settingStyles.formGroup}>
                          <label>Roll Number</label>
                          <p>{profile.rollNo}</p>
                        </div>

                        <div className={settingStyles.formGroup}>
                          <label>Department</label>
                          <p>{profile.department}</p>
                        </div>

                        <div className={settingStyles.formGroup}>
                          <label>Semester</label>
                          <p>{profile.semester}</p>
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
                            <p>{profile.email}</p>
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
                            <p>{profile.phone}</p>
                          )}
                        </div>

                        <div className={settingStyles.formGroup}>
                          <label>Date of Birth</label>
                          {isEditing ? (
                            <input
                              type="date"
                              name="dateOfBirth"
                              value={form.dateOfBirth}
                              onChange={handleChange}
                              className={styles.input}
                            />
                          ) : (
                            <p>{formatDate(profile.dateOfBirth)}</p>
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
                            <p>{profile.address}</p>
                          )}
                        </div>
                      </div>
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