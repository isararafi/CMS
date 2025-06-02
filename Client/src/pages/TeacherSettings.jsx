import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/pages/teacherSettings.module.scss';
import { 
  fetchTeacherProfile, 
  updateTeacherProfile
} from '../features/teacherSettings/teacherSettingsSlice';
import { useToast } from '../context/ToastContext';

const TeacherSettings = () => {
  const dispatch = useDispatch();
  const { profile, isLoading, error, successMessage } = useSelector(state => state.teacherSettings);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    education: ''
  });
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchTeacherProfile()).unwrap();
        showToast('Profile loaded successfully', 'success');
      } catch (error) {
        showToast(error.message || 'Failed to load profile', 'error');
      }
    };
    
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        email: profile.email || '',
        department: profile.department || '',
        education: profile.education || ''
      });
    }
  }, [profile]);

  const handleEdit = async () => {
    if (isEditing) {
      try {
        await dispatch(updateTeacherProfile(form)).unwrap();
        setIsEditing(false);
        showToast('Profile updated successfully', 'success');
      } catch (err) {
        showToast(err.message || 'Failed to update profile', 'error');
      }
    } else {
      setIsEditing(true);
      showToast('Now editing profile', 'info');
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    <div className={styles.settingsPage}>
      <h2>Profile Settings</h2>
      
      {error && <div className={styles.error}>{error}</div>}
      {successMessage && <div className={styles.success}>{successMessage}</div>}
      
      <div className={styles.profileSection}>
        <div className={styles.profileField}>
          <label>Name:</label>
          {isEditing ? (
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange}
              className={styles.input}
            />
          ) : (
            <span>{form.name || 'Not set'}</span>
          )}
        </div>
        <div className={styles.profileField}>
          <label>Email:</label>
          {isEditing ? (
            <input 
              name="email" 
              value={form.email} 
              onChange={handleChange}
              className={styles.input}
              type="email"
            />
          ) : (
            <span>{form.email || 'Not set'}</span>
          )}
        </div>
        <div className={styles.profileField}>
          <label>Department:</label>
          {isEditing ? (
            <input 
              name="department" 
              value={form.department} 
              onChange={handleChange}
              className={styles.input}
            />
          ) : (
            <span>{form.department || 'Not set'}</span>
          )}
        </div>
        <div className={styles.profileField}>
          <label>Education:</label>
          {isEditing ? (
            <input 
              name="education" 
              value={form.education} 
              onChange={handleChange}
              className={styles.input}
            />
          ) : (
            <span>{form.education || 'Not set'}</span>
          )}
        </div>
        <div className={styles.buttonGroup}>
          <button 
            onClick={handleEdit} 
            className={`${styles.editButton} ${isLoading ? styles.loading : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : isEditing ? 'Save Changes' : 'Edit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherSettings; 