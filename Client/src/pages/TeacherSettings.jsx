import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/pages/teacherSettings.module.scss';
import { 
  fetchTeacherProfile, 
  updateTeacherProfile,
  getProfileUpdateRequests 
} from '../features/teacherSettings/teacherSettingsSlice';

const TeacherSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, updateRequests, isLoading, error, successMessage } = useSelector(state => state.teacherSettings);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    position: ''
  });

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        await dispatch(fetchTeacherProfile()).unwrap();
        await dispatch(getProfileUpdateRequests()).unwrap();
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    // Update form when profile changes
    if (profile) {
      setForm({
        name: profile.name || '',
        email: profile.email || '',
        department: profile.department || '',
        position: profile.position || ''
      });
    }
  }, [profile]);

  const handleEdit = async () => {
    if (isEditing) {
      try {
        await dispatch(updateTeacherProfile(form)).unwrap();
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
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    // localStorage.removeItem('userType');
    // localStorage.removeItem('userRole');
    localStorage.removeItem('loglevel');
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
          <label>Position:</label>
          {isEditing ? (
            <input 
              name="position" 
              value={form.position} 
              onChange={handleChange}
              className={styles.input}
            />
          ) : (
            <span>{form.position || 'Not set'}</span>
          )}
        </div>
        <div className={styles.buttonGroup}>
          <button 
            onClick={handleEdit} 
            className={`${styles.editButton} ${isLoading ? styles.loading : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : isEditing ? 'Submit Request' : 'Edit'}
          </button>
          <button 
            onClick={handleLogout}
            className={`${styles.editButton} ${styles.logoutButton}`}
          >
            Logout
          </button>
        </div>
      </div>

      {updateRequests?.length > 0 && (
        <div className={`${styles.profileSection} ${styles.requestsSection}`}>
          <h3>Pending Update Requests</h3>
          {updateRequests.map((request, index) => (
            <div key={request._id || index} className={styles.updateRequest}>
              <div className={styles.requestDetails}>
                {Object.entries(request.updates || {}).map(([field, value]) => (
                  <div key={field} className={styles.fieldUpdate}>
                    <span className={styles.fieldName}>{field}:</span>
                    <span className={styles.fieldValue}>{value}</span>
                  </div>
                ))}
              </div>
              <div className={styles.requestStatus}>
                Status: <span>{request.status || 'Pending'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherSettings; 