import React, { useState, useEffect } from 'react'; // Import React, useState, and useEffect
import { Users, BookOpen, Bell, Settings, BarChart2, Building, Clipboard, UserCheck } from 'lucide-react'; // Import icons
import styles from '../styles/pages/dashboard.module.scss'; // Import styles
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import CustomTable from '../components/common/CustomTable';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStudents, fetchAllTeachers } from '../features/adminDashboard/adminDashboardSlice';
import { fetchAdminProfile } from '../features/auth/authSlice';
import { registerStudent, clearAddStudentState } from '../features/adminDashboard/addStudentSlice';
import { deleteStudent, clearDeleteStudentState } from '../features/adminDashboard/deleteStudentSlice';






/*In short, the $ is used in template literals to 
embed expressions inside a string. This allows you to dynamically construct a string, 
such as dynamically adding or removing class names based on conditions.*/

const AdminDashboard = ({ displayList }) => {
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [formData, setFormData] = useState({});
  const [formMessage, setFormMessage] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const dispatch = useDispatch();
  const { students, teachers, loadingStudents, loadingTeachers, errorStudents, errorTeachers } = useSelector(state => state.adminDashboard);
  const adminName = useSelector(state => state.auth.adminName);
  const adminEmail = useSelector(state => state.auth.adminEmail);
  const addStudentState = useSelector(state => state.addStudent);
  const deleteStudentState = useSelector(state => state.deleteStudent);

  useEffect(() => {
    dispatch(fetchAllStudents());
    dispatch(fetchAllTeachers());
    dispatch(fetchAdminProfile());
  }, [dispatch]);

  useEffect(() => {
    setFormData({});
    setFormMessage(null);
  }, [displayList]);

  useEffect(() => {
    if (addStudentState.successMessage) {
      setFormMessage({ type: 'success', text: addStudentState.successMessage });
      setFormData({});
      setTimeout(() => dispatch(clearAddStudentState()), 2000);
    } else if (addStudentState.error) {
      setFormMessage({ type: 'error', text: addStudentState.error });
      setTimeout(() => dispatch(clearAddStudentState()), 2000);
    }
  }, [addStudentState.successMessage, addStudentState.error, dispatch]);

  useEffect(() => {
    if (deleteStudentState.message) {
      setFormMessage({ type: 'success', text: deleteStudentState.message });
      dispatch(fetchAllStudents());
      setTimeout(() => dispatch(clearDeleteStudentState()), 2000);
    } else if (deleteStudentState.error) {
      setFormMessage({ type: 'error', text: deleteStudentState.error });
      setTimeout(() => dispatch(clearDeleteStudentState()), 2000);
    }
  }, [deleteStudentState.message, deleteStudentState.error, dispatch]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormMessage(null);
    if (displayList === 'createStudent') {
      // Prepare payload for student registration
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        rollNo: formData.rollNo,
        semester: formData.semester,
        department: formData.department,
        batch: formData.batch,
        phone: formData.phone,
        address: formData.address,
        // Add other fields as needed
      };
      dispatch(registerStudent(payload));
      return;
    }
    setFormLoading(true);
    setFormMessage(null);
    // Prepare payload based on displayList
    let payload = { ...formData };
    if (displayList === 'createTeacher') {
      payload.role = 'teacher';
    }
    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setFormMessage({ type: 'success', text: 'User created successfully!' });
        setFormData({});
      } else {
        setFormMessage({ type: 'error', text: data?.error?.details || data.message || 'Error creating user.' });
      }
    } catch (err) {
      setFormMessage({ type: 'error', text: 'Network error.' });
    }
    setFormLoading(false);
  };

  // Update modal handlers
  const handleUpdateClick = (role, user) => {
    setUpdateRole(role);
    setUpdateUser(user);
    setUpdateForm({ ...user });
    setShowUpdateModal(true);
    setUpdateMessage(null);
  };
  const handleUpdateFormChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMessage(null);
    const endpoint = updateRole === 'student' ? `/api/admin/student/${updateUser.id}` : `/api/admin/teacher/${updateUser.id}`;
    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateForm)
      });
      const data = await res.json();
      if (res.ok) {
        setUpdateMessage({ type: 'success', text: 'User updated successfully!' });
        // Update local table
        if (updateRole === 'student') {
          setStudents(students.map(s => s.id === updateUser.id ? { ...s, ...updateForm } : s));
        } else {
          setTeachers(teachers.map(t => t.id === updateUser.id ? { ...t, ...updateForm } : t));
        }
        setShowUpdateModal(false);
      } else {
        setUpdateMessage({ type: 'error', text: data?.error?.details || data.message || 'Error updating user.' });
      }
    } catch (err) {
      setUpdateMessage({ type: 'error', text: 'Network error.' });
    }
    setUpdateLoading(false);
  };
  const handleDeleteClick = async (role, user) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    if (role === 'student') {
      dispatch(deleteStudent(user._id || user.id));
      return;
    }
    const endpoint = role === 'student' ? `/api/admin/student/${user.id}` : `/api/admin/teacher/${user.id}`;
    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        if (role === 'student') {
          setStudents(students.filter(s => s.id !== user.id));
        } else {
          setTeachers(teachers.filter(t => t.id !== user.id));
        }
      } else {
        alert('Error deleting user.');
      }
    } catch {
      alert('Network error.');
    }
  };

  // Form style for create student/teacher
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
  const formFieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };
  const inputStyle = {
    padding: '12px 16px',
    border: '1px solid #bdbdbd',
    borderRadius: '8px',
    fontSize: '1rem',
    background: '#f8f9fa',
    color: '#222',
    outline: 'none',
    transition: 'border 0.2s',
  };
  const labelStyle = {
    fontWeight: 500,
    color: '#1B5E20',
    fontSize: '1rem',
    marginBottom: '2px',
  };
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
    transition: 'background 0.2s',
  };
  const dividerStyle = {
    height: '1px',
    background: 'linear-gradient(90deg, #e0e0e0, #bfe4bf, #e0e0e0)',
    border: 'none',
    margin: '0.5rem 0 1.5rem 0',
  };
  // Responsive tweaks
  const formCardResponsive = {
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
  };

  // Modal state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateRole, setUpdateRole] = useState(null);
  const [updateUser, setUpdateUser] = useState(null);
  const [updateForm, setUpdateForm] = useState({});
  const [updateMessage, setUpdateMessage] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} role="admin" />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className={styles.contentWrapper}>
          <div className={styles.dashboardContainer}> {/* Dashboard container */}
            <div className={styles.dashboardHeader}>
              {/* Header section with admin info */}
              <div className={styles.welcomeSection}>
                <h1>Welcome {adminName}</h1>
                <p className={styles.subtitle}>Admin Dashboard</p>
              </div>
              <div className={styles.adminInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Position:</span>
                  <span className={styles.value}>{adminData.position}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Email:</span>
                  <span className={styles.value}>{adminEmail}</span>
                </div>
              </div>
            </div>

            <div className={styles.statsContainer}>
              {/* Stats section with cards for students, faculty */}
              <div className={styles.statCard}>
                <div className={styles.statIcon}><Users size={24} /></div>
                <div className={styles.statContent}>
                  <h3 className={styles.statValue}>{loadingStudents ? '...' : students.length}</h3>
                  <p className={styles.statLabel}>Total Students</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><UserCheck size={24} /></div>
                <div className={styles.statContent}>
                  <h3 className={styles.statValue}>{loadingTeachers ? '...' : teachers.length}</h3>
                  <p className={styles.statLabel}>Faculty Members</p>
                </div>
              </div>
            </div>

            {/* Render create form or tables based on displayList */}
            {displayList === 'createStudent' && (
              <div style={{ ...formCardStyle, ...formCardResponsive }}>
                <h2 style={{ color: '#1B5E20', fontWeight: 700, fontSize: '1.5rem', margin: 0 }}>Create Student</h2>
                <hr style={dividerStyle} />
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={formFieldStyle}>
                    <label style={labelStyle} htmlFor="student-name">Name</label>
                    <input id="student-name" name="name" value={formData.name || ''} onChange={handleFormChange} placeholder="Name" required style={inputStyle} />
                  </div>
                  <div style={formFieldStyle}>
                    <label style={labelStyle} htmlFor="student-email">Email</label>
                    <input id="student-email" name="email" value={formData.email || ''} onChange={handleFormChange} placeholder="Email" required style={inputStyle} />
                  </div>
                  <div style={formFieldStyle}>
                    <label style={labelStyle} htmlFor="student-password">Password</label>
                    <input id="student-password" name="password" type="password" value={formData.password || ''} onChange={handleFormChange} placeholder="Password" required style={inputStyle} />
                  </div>
                  <div style={formFieldStyle}>
                    <label style={labelStyle} htmlFor="student-rollno">Roll No</label>
                    <input id="student-rollno" name="rollNo" value={formData.rollNo || ''} onChange={handleFormChange} placeholder="Roll No" required style={inputStyle} />
                  </div>
                  <div style={formFieldStyle}>
                    <label style={labelStyle} htmlFor="student-semester">Semester</label>
                    <input id="student-semester" name="semester" type="number" value={formData.semester || ''} onChange={handleFormChange} placeholder="Semester" required style={inputStyle} />
                  </div>
                  <div style={formFieldStyle}>
                    <label style={labelStyle} htmlFor="student-department">Department</label>
                    <input id="student-department" name="department" value={formData.department || ''} onChange={handleFormChange} placeholder="Department" required style={inputStyle} />
                  </div>
                  <div style={formFieldStyle}>
                    <label style={labelStyle} htmlFor="student-batch">Batch</label>
                    <input id="student-batch" name="batch" value={formData.batch || ''} onChange={handleFormChange} placeholder="Batch" required style={inputStyle} />
                  </div>
                  <div style={formFieldStyle}>
                    <label style={labelStyle} htmlFor="student-phone">Phone</label>
                    <input id="student-phone" name="phone" value={formData.phone || ''} onChange={handleFormChange} placeholder="Phone" required style={inputStyle} />
                  </div>
                  <div style={formFieldStyle}>
                    <label style={labelStyle} htmlFor="student-address">Address</label>
                    <input id="student-address" name="address" value={formData.address || ''} onChange={handleFormChange} placeholder="Address" required style={inputStyle} />
                  </div>
                  <button type="submit" disabled={formLoading} style={buttonStyle}>ADD</button>
                </form>
                {formMessage && (
                  <div style={{ marginTop: '1rem', color: formMessage.type === 'success' ? 'green' : 'red', textAlign: 'center', fontWeight: 500 }}>{formMessage.text}</div>
                )}
              </div>
            )}
            {displayList === 'createTeacher' && (
              <div style={{ ...formCardStyle, ...formCardResponsive }}>
                <h2 style={{ color: '#1B5E20', fontWeight: 700, fontSize: '1.5rem', margin: 0 }}>Create Teacher</h2>
                <hr style={dividerStyle} />
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={formFieldStyle}>
                    <label style={labelStyle} htmlFor="teacher-name">Name</label>
                    <input id="teacher-name" name="name" value={formData.name || ''} onChange={handleFormChange} placeholder="Name" required style={inputStyle} />
                  </div>
                  <div style={formFieldStyle}>
                    <label style={labelStyle} htmlFor="teacher-email">Email</label>
                    <input id="teacher-email" name="email" value={formData.email || ''} onChange={handleFormChange} placeholder="Email" required style={inputStyle} />
                  </div>
                  <div style={formFieldStyle}>
                    <label style={labelStyle} htmlFor="teacher-education">Education</label>
                    <input id="teacher-education" name="education" value={formData.education || ''} onChange={handleFormChange} placeholder="Education" required style={inputStyle} />
                  </div>
                  <div style={formFieldStyle}>
                    <label style={labelStyle} htmlFor="teacher-department">Department</label>
                    <input id="teacher-department" name="department" value={formData.department || ''} onChange={handleFormChange} placeholder="Department" required style={inputStyle} />
                  </div>
                  <div style={formFieldStyle}>
                    <label style={labelStyle} htmlFor="teacher-password">Password</label>
                    <input id="teacher-password" name="password" type="password" value={formData.password || ''} onChange={handleFormChange} placeholder="Password" required style={inputStyle} />
                  </div>
                  <div style={formFieldStyle}>
                    <label style={labelStyle} htmlFor="teacher-confirmPassword">Confirm Password</label>
                    <input id="teacher-confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword || ''} onChange={handleFormChange} placeholder="Confirm Password" required style={inputStyle} />
                  </div>
                  <button type="submit" disabled={formLoading} style={buttonStyle}>ADD</button>
                </form>
                {formMessage && (
                  <div style={{ marginTop: '1rem', color: formMessage.type === 'success' ? 'green' : 'red', textAlign: 'center', fontWeight: 500 }}>{formMessage.text}</div>
                )}
              </div>
            )}
            {displayList === 'students' && (
              <div style={{ marginTop: '2rem' }}>
                <h2>All Students</h2>
                <CustomTable
                  headers={['Name', 'Reg No', 'Department', 'Actions']}
                  data={students.map(student => ({
                    Name: student.name,
                    'Reg No': student.rollNo || student.regNo,
                    Department: student.department,
                    actions: {
                      view: true,
                      cancel: true
                    },
                    _original: student // for action handlers
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
                  headers={['Name', 'Email', 'Department', 'Actions']}
                  data={teachers.map(teacher => ({
                    Name: teacher.name,
                    Email: teacher.email,
                    Department: teacher.department,
                    actions: {
                      view: true,
                      cancel: true
                    },
                    _original: teacher // for action handlers
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
                <div style={{ ...formCardStyle, ...formCardResponsive, minWidth: 350, maxWidth: 500, position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
                  <button
                    onClick={() => setShowUpdateModal(false)}
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      background: 'transparent',
                      border: 'none',
                      fontSize: 28,
                      cursor: 'pointer',
                      color: '#000',
                      zIndex: 2,
                      padding: 0,
                      lineHeight: 1
                    }}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <h2 style={{ color: '#1B5E20', fontWeight: 700, fontSize: '1.5rem', margin: 0, textAlign: 'center' }}>Update {updateRole === 'student' ? 'Student' : 'Teacher'}</h2>
                  <hr style={dividerStyle} />
                  <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {updateRole === 'student' ? (
                      <>
                        <div style={formFieldStyle}>
                          <label style={labelStyle} htmlFor="update-student-name">Name</label>
                          <input id="update-student-name" name="name" value={updateForm.name || ''} onChange={handleUpdateFormChange} placeholder="Name" required style={inputStyle} />
                        </div>
                        <div style={formFieldStyle}>
                          <label style={labelStyle} htmlFor="update-student-regNo">Registration Number</label>
                          <input id="update-student-regNo" name="regNo" value={updateForm.regNo || ''} onChange={handleUpdateFormChange} placeholder="Registration Number" required style={inputStyle} />
                        </div>
                        <div style={formFieldStyle}>
                          <label style={labelStyle} htmlFor="update-student-batch">Batch</label>
                          <input id="update-student-batch" name="batch" value={updateForm.batch || ''} onChange={handleUpdateFormChange} placeholder="Batch" required style={inputStyle} />
                        </div>
                        <div style={formFieldStyle}>
                          <label style={labelStyle} htmlFor="update-student-year">Year</label>
                          <input id="update-student-year" name="year" value={updateForm.year || ''} onChange={handleUpdateFormChange} placeholder="Year" required style={inputStyle} />
                        </div>
                        <div style={formFieldStyle}>
                          <label style={labelStyle} htmlFor="update-student-department">Department</label>
                          <input id="update-student-department" name="department" value={updateForm.department || ''} onChange={handleUpdateFormChange} placeholder="Department" required style={inputStyle} />
                        </div>
                        <div style={formFieldStyle}>
                          <label style={labelStyle} htmlFor="update-student-password">Password</label>
                          <input id="update-student-password" name="password" type="password" value={updateForm.password || ''} onChange={handleUpdateFormChange} placeholder="Password" style={inputStyle} />
                        </div>
                        <div style={formFieldStyle}>
                          <label style={labelStyle} htmlFor="update-student-email">Email</label>
                          <input id="update-student-email" name="email" value={updateForm.email || ''} onChange={handleUpdateFormChange} placeholder="Email" style={inputStyle} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={formFieldStyle}>
                          <label style={labelStyle} htmlFor="update-teacher-name">Name</label>
                          <input id="update-teacher-name" name="name" value={updateForm.name || ''} onChange={handleUpdateFormChange} placeholder="Name" required style={inputStyle} />
                        </div>
                        <div style={formFieldStyle}>
                          <label style={labelStyle} htmlFor="update-teacher-email">Email</label>
                          <input id="update-teacher-email" name="email" value={updateForm.email || ''} onChange={handleUpdateFormChange} placeholder="Email" required style={inputStyle} />
                        </div>
                        <div style={formFieldStyle}>
                          <label style={labelStyle} htmlFor="update-teacher-education">Education</label>
                          <input id="update-teacher-education" name="education" value={updateForm.education || ''} onChange={handleUpdateFormChange} placeholder="Education" required style={inputStyle} />
                        </div>
                        <div style={formFieldStyle}>
                          <label style={labelStyle} htmlFor="update-teacher-department">Department</label>
                          <input id="update-teacher-department" name="department" value={updateForm.department || ''} onChange={handleUpdateFormChange} placeholder="Department" required style={inputStyle} />
                        </div>
                        <div style={formFieldStyle}>
                          <label style={labelStyle} htmlFor="update-teacher-password">Password</label>
                          <input id="update-teacher-password" name="password" type="password" value={updateForm.password || ''} onChange={handleUpdateFormChange} placeholder="Password" style={inputStyle} />
                        </div>
                      </>
                    )}
                    <button type="submit" disabled={updateLoading} style={buttonStyle}>Update</button>
                  </form>
                  {updateMessage && (
                    <div style={{ marginTop: '1rem', color: updateMessage.type === 'success' ? 'green' : 'red', textAlign: 'center', fontWeight: 500 }}>{updateMessage.text}</div>
                  )}
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
