import React, { useState, useEffect } from 'react'; // Import React, useState, and useEffect
import { Users, BookOpen, Bell, Settings, BarChart2, Building, Clipboard, UserCheck } from 'lucide-react'; // Import icons
import styles from '../styles/pages/dashboard.module.scss'; // Import styles
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';






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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createRole, setCreateRole] = useState(null);
  const [formData, setFormData] = useState({});
  const [formMessage, setFormMessage] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Use local state for students and teachers so we can update/delete
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice Smith', regNo: '2021001', department: 'Computer Science', batch: '2021', year: '1', rollno: '001', password: '', confirmPassword: '' },
    { id: 2, name: 'Bob Johnson', regNo: '2021002', department: 'Mathematics', batch: '2021', year: '1', rollno: '002', password: '', confirmPassword: '' },
    { id: 3, name: 'Charlie Brown', regNo: '2021003', department: 'Physics', batch: '2021', year: '1', rollno: '003', password: '', confirmPassword: '' },
  ]);
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Dr. Emily White', email: 'emily.white@university.edu', department: 'Computer Science', education: '', password: '', confirmPassword: '' },
    { id: 2, name: 'Dr. John Black', email: 'john.black@university.edu', department: 'Mathematics', education: '', password: '', confirmPassword: '' },
    { id: 3, name: 'Dr. Sarah Green', email: 'sarah.green@university.edu', department: 'Physics', education: '', password: '', confirmPassword: '' },
  ]);

  // Modal state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateRole, setUpdateRole] = useState(null);
  const [updateUser, setUpdateUser] = useState(null);
  const [updateForm, setUpdateForm] = useState({});
  const [updateMessage, setUpdateMessage] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    setShowCreateForm(false);
    setCreateRole(null);
    setFormData({});
    setFormMessage(null);
  }, [displayList]);

  const handleCreateClick = (role) => {
    setShowCreateForm(true);
    setCreateRole(role);
    setFormData({});
    setFormMessage(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMessage(null);
    // Prepare payload based on role
    let payload = { ...formData, role: createRole };
    // For student, combine batch/year/rollno into regNo if needed
    if (createRole === 'student' && formData.batch && formData.year && formData.rollno) {
      payload.regNo = `${formData.batch}-${formData.year}-${formData.rollno}`;
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

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} role="admin" onCreateClick={handleCreateClick} />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className={styles.contentWrapper}>
          <div className={styles.dashboardContainer}> {/* Dashboard container */}
            <div className={styles.dashboardHeader}>
              {/* Header section with admin info */}
              <div className={styles.welcomeSection}>
                <h1>Welcome, {adminData.name}</h1>
                <p className={styles.subtitle}>Admin Dashboard • {adminData.department}</p>
              </div>
              <div className={styles.adminInfo}>
                {/* Display admin position and email */}
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
              {/* Stats section with cards for students, faculty */}
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
            </div>

            {/* Inline create form for student or teacher */}
            {showCreateForm ? (
              <div style={{ marginTop: '2rem', marginBottom: '2rem', background: '#f9f9f9', padding: '2rem', borderRadius: '8px', maxWidth: 600 }}>
                <h2>Create {createRole === 'student' ? 'Student' : 'Teacher'}</h2>
                <form onSubmit={handleFormSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {createRole === 'student' ? (
                      <>
                        <label>
                          Name
                          <input name="name" value={formData.name || ''} onChange={handleFormChange} placeholder="Name" required style={{ padding: '8px', marginTop: 4 }} />
                        </label>
                        <label>
                          Batch
                          <input name="batch" value={formData.batch || ''} onChange={handleFormChange} placeholder="Batch" required style={{ padding: '8px', marginTop: 4 }} />
                        </label>
                        <label>
                          Year
                          <input name="year" value={formData.year || ''} onChange={handleFormChange} placeholder="Year" required style={{ padding: '8px', marginTop: 4 }} />
                        </label>
                        <label>
                          Roll No
                          <input name="rollno" value={formData.rollno || ''} onChange={handleFormChange} placeholder="Roll No" required style={{ padding: '8px', marginTop: 4 }} />
                        </label>
                        <label>
                          Department
                          <input name="department" value={formData.department || ''} onChange={handleFormChange} placeholder="Department" required style={{ padding: '8px', marginTop: 4 }} />
                        </label>
                        <label>
                          Email
                          <input name="email" value={formData.email || ''} onChange={handleFormChange} placeholder="Email" required style={{ padding: '8px', marginTop: 4 }} />
                        </label>
                      </>
                    ) : (
                      <>
                        <label>
                          Name
                          <input name="name" value={formData.name || ''} onChange={handleFormChange} placeholder="Name" required style={{ padding: '8px', marginTop: 4 }} />
                        </label>
                        <label>
                          Email
                          <input name="email" value={formData.email || ''} onChange={handleFormChange} placeholder="Email" required style={{ padding: '8px', marginTop: 4 }} />
                        </label>
                        <label>
                          Education
                          <input name="education" value={formData.education || ''} onChange={handleFormChange} placeholder="Education" required style={{ padding: '8px', marginTop: 4 }} />
                        </label>
                        <label>
                          Department
                          <input name="department" value={formData.department || ''} onChange={handleFormChange} placeholder="Department" required style={{ padding: '8px', marginTop: 4 }} />
                        </label>
                      </>
                    )}
                    <label>
                      Password
                      <input name="password" type="password" value={formData.password || ''} onChange={handleFormChange} placeholder="Password" required style={{ padding: '8px', marginTop: 4 }} />
                    </label>
                    <label>
                      Confirm Password
                      <input name="confirmPassword" type="password" value={formData.confirmPassword || ''} onChange={handleFormChange} placeholder="Confirm Password" required style={{ padding: '8px', marginTop: 4 }} />
                    </label>
                    <button type="submit" disabled={formLoading} style={{ padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ADD</button>
                  </div>
                </form>
                {formMessage && (
                  <div style={{ marginTop: '1rem', color: formMessage.type === 'success' ? 'green' : 'red' }}>{formMessage.text}</div>
                )}
              </div>
            ) : (
              <>
                {displayList === 'students' && !showCreateForm && (
                  <div style={{ marginTop: '2rem' }}>
                    <h2>All Students</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                      <thead>
                        <tr style={{ background: '#f5f5f5' }}>
                          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Name</th>
                          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Reg No</th>
                          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Department</th>
                          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(student => (
                          <tr key={student.id}>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{student.name}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{student.regNo}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{student.department}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                              <button onClick={() => handleUpdateClick('student', student)} style={{ marginRight: 8 }}>Update</button>
                              <button onClick={() => handleDeleteClick('student', student)} style={{ color: 'red' }}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {displayList === 'teachers' && !showCreateForm && (
                  <div style={{ marginTop: '2rem' }}>
                    <h2>All Teachers</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                      <thead>
                        <tr style={{ background: '#f5f5f5' }}>
                          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Name</th>
                          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Email</th>
                          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Department</th>
                          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teachers.map(teacher => (
                          <tr key={teacher.id}>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{teacher.name}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{teacher.email}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{teacher.department}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                              <button onClick={() => handleUpdateClick('teacher', teacher)} style={{ marginRight: 8 }}>Update</button>
                              <button onClick={() => handleDeleteClick('teacher', teacher)} style={{ color: 'red' }}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {/* Update Modal */}
            {showUpdateModal && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', minWidth: 350, maxWidth: 500, position: 'relative' }}>
                  <button onClick={() => setShowUpdateModal(false)} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>×</button>
                  <h2>Update {updateRole === 'student' ? 'Student' : 'Teacher'}</h2>
                  <form onSubmit={handleUpdateSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {updateRole === 'student' ? (
                        <>
                          <label>
                            Name
                            <input name="name" value={updateForm.name || ''} onChange={handleUpdateFormChange} placeholder="Name" required style={{ padding: '8px', marginTop: 4 }} />
                          </label>
                          <label>
                            Registration Number
                            <input name="regNo" value={updateForm.regNo || ''} onChange={handleUpdateFormChange} placeholder="Registration Number" required style={{ padding: '8px', marginTop: 4 }} />
                          </label>
                          <label>
                            Batch
                            <input name="batch" value={updateForm.batch || ''} onChange={handleUpdateFormChange} placeholder="Batch" required style={{ padding: '8px', marginTop: 4 }} />
                          </label>
                          <label>
                            Year
                            <input name="year" value={updateForm.year || ''} onChange={handleUpdateFormChange} placeholder="Year" required style={{ padding: '8px', marginTop: 4 }} />
                          </label>
                          <label>
                            Department
                            <input name="department" value={updateForm.department || ''} onChange={handleUpdateFormChange} placeholder="Department" required style={{ padding: '8px', marginTop: 4 }} />
                          </label>
                          <label>
                            Password
                            <input name="password" type="password" value={updateForm.password || ''} onChange={handleUpdateFormChange} placeholder="Password" style={{ padding: '8px', marginTop: 4 }} />
                          </label>
                          <label>
                            Email
                            <input name="email" value={updateForm.email || ''} onChange={handleUpdateFormChange} placeholder="Email" style={{ padding: '8px', marginTop: 4 }} />
                          </label>
                        </>
                      ) : (
                        <>
                          <label>
                            Name
                            <input name="name" value={updateForm.name || ''} onChange={handleUpdateFormChange} placeholder="Name" required style={{ padding: '8px', marginTop: 4 }} />
                          </label>
                          <label>
                            Email
                            <input name="email" value={updateForm.email || ''} onChange={handleUpdateFormChange} placeholder="Email" required style={{ padding: '8px', marginTop: 4 }} />
                          </label>
                          <label>
                            Education
                            <input name="education" value={updateForm.education || ''} onChange={handleUpdateFormChange} placeholder="Education" required style={{ padding: '8px', marginTop: 4 }} />
                          </label>
                          <label>
                            Department
                            <input name="department" value={updateForm.department || ''} onChange={handleUpdateFormChange} placeholder="Department" required style={{ padding: '8px', marginTop: 4 }} />
                          </label>
                          <label>
                            Password
                            <input name="password" type="password" value={updateForm.password || ''} onChange={handleUpdateFormChange} placeholder="Password" style={{ padding: '8px', marginTop: 4 }} />
                          </label>
                        </>
                      )}
                      <button type="submit" disabled={updateLoading} style={{ padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Update</button>
                    </div>
                  </form>
                  {updateMessage && (
                    <div style={{ marginTop: '1rem', color: updateMessage.type === 'success' ? 'green' : 'red' }}>{updateMessage.text}</div>
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
