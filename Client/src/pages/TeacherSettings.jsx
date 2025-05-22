import React, { useState } from 'react';
import styles from '../styles/pages/teacherSettings.module.scss';

const TeacherSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Dr. Emily Johnson',
    email: 'emily.johnson@university.edu',
    department: 'Computer Science',
    position: 'Associate Professor'
  });
  const [form, setForm] = useState(profile);

  const handleEdit = () => {
    if (isEditing) setProfile(form);
    setIsEditing(!isEditing);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.settingsPage}>
      <h2>Settings</h2>
      <div className={styles.profileSection}>
        <div className={styles.profileField}>
          <label>Name:</label>
          {isEditing ? (
            <input name="name" value={form.name} onChange={handleChange} />
          ) : (
            <span>{profile.name}</span>
          )}
        </div>
        <div className={styles.profileField}>
          <label>Email:</label>
          {isEditing ? (
            <input name="email" value={form.email} onChange={handleChange} />
          ) : (
            <span>{profile.email}</span>
          )}
        </div>
        <div className={styles.profileField}>
          <label>Department:</label>
          {isEditing ? (
            <input name="department" value={form.department} onChange={handleChange} />
          ) : (
            <span>{profile.department}</span>
          )}
        </div>
        <div className={styles.profileField}>
          <label>Position:</label>
          {isEditing ? (
            <input name="position" value={form.position} onChange={handleChange} />
          ) : (
            <span>{profile.position}</span>
          )}
        </div>
        <button onClick={handleEdit} className={styles.editButton}>
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
    </div>
  );
};

export default TeacherSettings; 