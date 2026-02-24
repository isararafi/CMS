import React, { useState, useEffect } from 'react';
import styles from '../styles/pages/teacherSettings.module.scss';

const TeacherSettings = () => {
  // Mock profile data
  const mockProfile = {
    name: 'Ali Khan',
    email: 'ali.khan@example.com',
    department: 'Computer Science',
    education: 'BSSE'
  };

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    education: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading profile
    setTimeout(() => {
      setProfile(mockProfile);
      setForm(mockProfile);
      setIsLoading(false);
    }, 500); // simulate network delay
  }, []);

  const handleEdit = () => {
    if (isEditing) {
      // Save changes (mock)
      setProfile(form);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } else {
      setIsEditing(true);
      setMessage({ type: 'info', text: 'Now editing profile' });
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return (
      <div className={styles.settingsPage}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className={styles.settingsPage}>
      <h2>Profile Settings</h2>

      {message.text && (
        <div className={message.type === 'error' ? styles.error : styles.success}>
          {message.text}
        </div>
      )}

      <div className={styles.profileSection}>
        {['name', 'email', 'department', 'education'].map(field => (
          <div key={field} className={styles.profileField}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            {isEditing ? (
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                className={styles.input}
                type={field === 'email' ? 'email' : 'text'}
              />
            ) : (
              <span>{form[field] || 'Not set'}</span>
            )}
          </div>
        ))}

        <div className={styles.buttonGroup}>
          <button
            onClick={handleEdit}
            className={styles.editButton}
            disabled={isLoading}
          >
            {isEditing ? 'Save Changes' : 'Edit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherSettings;