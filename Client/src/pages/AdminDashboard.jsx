import React, { useState, useEffect } from 'react';
import { Users, UserCheck } from 'lucide-react';
import styles from '../styles/pages/dashboard.module.scss';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import CustomTable from '../components/common/CustomTable';
import { useToast } from '../context/ToastContext';

const AdminDashboard = ({ displayList }) => {
  // Mock admin data
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
    }
  };

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [formData, setFormData] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  // Update modal state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateRole, setUpdateRole] = useState(null);
  const [updateUser, setUpdateUser] = useState(null);
  const [updateForm, setUpdateForm] = useState({});

  const { showToast } = useToast();

  // Mock data for tables
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Form handlers
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    // Here you can integrate your new API
    try {
      console.log("Form submitted for:", displayList, formData);
      showToast(`${displayList === 'createStudent' ? 'Student' : 'Teacher'} submitted`, 'success');
      setFormData({});
    } catch (error) {
      showToast('Error submitting form', 'error');
    }
    setFormLoading(false);
  };

  const handleUpdateClick = (role, user) => {
    setUpdateRole(role);
    setUpdateUser(user);
    setUpdateForm({ ...user });
    setShowUpdateModal(true);
  };

  const handleUpdateFormChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    // Integrate your update API here
    console.log("Update submitted for:", updateRole, updateForm);
    showToast(`${updateRole === 'student' ? 'Student' : 'Teacher'} updated`, 'success');
    setShowUpdateModal(false);
  };

  const handleDeleteClick = (role, user) => {
    // Integrate your delete API here
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    console.log("Delete requested for:", role, user);
    showToast(`${role === 'student' ? 'Student' : 'Teacher'} deleted`, 'success');
  };

  // Styles
  const formCardStyle = {
    marginTop: '2rem',
    marginBottom: '2rem',
    background: 'rgba(255,255,255,0.95)',
    padding: '2rem',
    borderRadius: '20px',
    maxWidth: 500,
    width: '100%',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    border: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '1.5rem',
  };
  const formFieldStyle = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };
  const inputStyle = {
    padding: '12px 16px',
    border: '1px solid #bdbdbd',
    borderRadius: '8px',
    fontSize: '1rem',
    background: '#f8f9fa',
    color: '#222',
    outline: 'none',
  };
  const labelStyle = { fontWeight: 500, color: '#1B5E20', fontSize: '1rem', marginBottom: '2px' };
  const buttonStyle = {
    padding: '12px',
    background: '#2E7D32',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
  };
  const dividerStyle = { height: '1px', background: '#e0e0e0', border: 'none', margin: '0.5rem 0 1.5rem 0' };

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} role="admin" />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className={styles.contentWrapper}>
          <div className={styles.dashboardContainer}>
            {/* Header */}
            <div className={styles.dashboardHeader}>
              <div className={styles.welcomeSection}>
                <h1>Welcome {adminData.name}</h1>
                <p className={styles.subtitle}>Admin Dashboard</p>
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

            {/* Stats */}
            <div className={styles.statsContainer}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><Users size={24} /></div>
                <div className={styles.statContent}>
                  <h3 className={styles.statValue}>{students.length}</h3>
                  <p className={styles.statLabel}>Total Students</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><UserCheck size={24} /></div>
                <div className={styles.statContent}>
                  <h3 className={styles.statValue}>{teachers.length}</h3>
                  <p className={styles.statLabel}>Faculty Members</p>
                </div>
              </div>
            </div>

            {/* Forms */}
            {displayList === 'createStudent' && (
              <div style={formCardStyle}>
                <h2 style={{ color: '#1B5E20', fontWeight: 700 }}>Create Student</h2>
                <hr style={dividerStyle} />
                <form onSubmit={handleFormSubmit}>
                  <div style={formFieldStyle}>
                    <label style={labelStyle}>Name</label>
                    <input name="name" value={formData.name || ''} onChange={handleFormChange} style={inputStyle} required />
                  </div>
                  <div style={formFieldStyle}>
                    <label style={labelStyle}>Email</label>
                    <input name="email" value={formData.email || ''} onChange={handleFormChange} style={inputStyle} required />
                  </div>
                  <button type="submit" disabled={formLoading} style={buttonStyle}>ADD</button>
                </form>
              </div>
            )}

            {displayList === 'createTeacher' && (
              <div style={formCardStyle}>
                <h2 style={{ color: '#1B5E20', fontWeight: 700 }}>Create Teacher</h2>
                <hr style={dividerStyle} />
                <form onSubmit={handleFormSubmit}>
                  <div style={formFieldStyle}>
                    <label style={labelStyle}>Name</label>
                    <input name="name" value={formData.name || ''} onChange={handleFormChange} style={inputStyle} required />
                  </div>
                  <div style={formFieldStyle}>
                    <label style={labelStyle}>Email</label>
                    <input name="email" value={formData.email || ''} onChange={handleFormChange} style={inputStyle} required />
                  </div>
                  <button type="submit" disabled={formLoading} style={buttonStyle}>ADD</button>
                </form>
              </div>
            )}

            {/* Tables */}
            {displayList === 'students' && (
              <div style={{ marginTop: '2rem' }}>
                <h2>All Students</h2>
                <CustomTable
                  headers={['Name', 'Actions']}
                  data={students.map(student => ({
                    Name: student.name,
                    actions: { view: true, cancel: true },
                    _original: student
                  }))}
                  onView={row => handleUpdateClick('student', row._original)}
                  onCancel={row => handleDeleteClick('student', row._original)}
                  role="admin"
                />
              </div>
            )}

            {displayList === 'teachers' && (
              <div style={{ marginTop: '2rem' }}>
                <h2>All Teachers</h2>
                <CustomTable
                  headers={['Name', 'Actions']}
                  data={teachers.map(teacher => ({
                    Name: teacher.name,
                    actions: { view: true, cancel: true },
                    _original: teacher
                  }))}
                  onView={row => handleUpdateClick('teacher', row._original)}
                  onCancel={row => handleDeleteClick('teacher', row._original)}
                  role="admin"
                />
              </div>
            )}

            {/* Update Modal */}
            {showUpdateModal && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={formCardStyle}>
                  <button onClick={() => setShowUpdateModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', fontSize: 28, cursor: 'pointer' }}>×</button>
                  <h2 style={{ color: '#1B5E20', fontWeight: 700, textAlign: 'center' }}>Update {updateRole}</h2>
                  <hr style={dividerStyle} />
                  <form onSubmit={handleUpdateSubmit}>
                    <div style={formFieldStyle}>
                      <label style={labelStyle}>Name</label>
                      <input name="name" value={updateForm.name || ''} onChange={handleUpdateFormChange} style={inputStyle} required />
                    </div>
                    <button type="submit" style={buttonStyle}>Update</button>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;