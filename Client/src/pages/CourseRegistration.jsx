import React, { useState } from 'react';
import { BookOpenCheck, CheckCircle, AlertCircle, Search } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import CustomTable from '../components/common/CustomTable';
import styles from '../styles/pages/dashboard.module.scss';

const CourseRegistration = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);

  // Mock data - would be fetched from API
  const availableCourses = [
    { id: 1, code: 'CS301', name: 'Database Systems', credits: 3, instructor: 'Dr. Smith', seats: 45, enrolled: 32, status: 'open' },
    { id: 2, code: 'CS302', name: 'Operating Systems', credits: 4, instructor: 'Dr. Johnson', seats: 40, enrolled: 40, status: 'closed' },
    { id: 3, code: 'CS303', name: 'Software Engineering', credits: 3, instructor: 'Dr. Williams', seats: 50, enrolled: 35, status: 'open' },
    { id: 4, code: 'CS304', name: 'Computer Networks', credits: 3, instructor: 'Dr. Brown', seats: 45, enrolled: 30, status: 'open' },
    { id: 5, code: 'CS305', name: 'Artificial Intelligence', credits: 4, instructor: 'Dr. Davis', seats: 35, enrolled: 33, status: 'open' },
    { id: 6, code: 'CS306', name: 'Web Engineering', credits: 3, instructor: 'Dr. Miller', seats: 45, enrolled: 40, status: 'open' },
    { id: 7, code: 'CS307', name: 'Mobile App Development', credits: 3, instructor: 'Dr. Wilson', seats: 40, enrolled: 28, status: 'open' },
    { id: 8, code: 'CS308', name: 'Data Mining', credits: 3, instructor: 'Dr. Moore', seats: 35, enrolled: 35, status: 'closed' },
  ];

  const studentRegistrationInfo = {
    name: "John Smith",
    rollNo: "Fall 23-BSSE-123",
    semester: "Fall 2023",
    department: "Software Engineering",
    maxCredits: 18,
    registrationStatus: "open",
    registrationDeadline: "2023-08-15"
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCourses = availableCourses.filter(course => 
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCourse = (course) => {
    // Find the original course object using the id
    const originalCourse = availableCourses.find(c => c.id === course.id);
    if (!originalCourse) return;
    
    // Check if course is already selected
    if (selectedCourses.some(selected => selected.id === originalCourse.id)) {
      setSelectedCourses(selectedCourses.filter(selected => selected.id !== originalCourse.id));
      return;
    }

    // Check if course is closed
    if (originalCourse.status === 'closed') {
      return;
    }

    // Check if adding this course would exceed max credits
    const currentCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);
    if (currentCredits + originalCourse.credits > studentRegistrationInfo.maxCredits) {
      return;
    }

    setSelectedCourses([...selectedCourses, originalCourse]);
  };

  const currentCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);

  const handleSubmitRegistration = () => {
    // In a real app, this would be an API call
    console.log("Submitting registration for courses:", selectedCourses);
    
    // Show success message
    setRegistrationSubmitted(true);
    
    // Reset after 5 seconds
    setTimeout(() => {
      setRegistrationSubmitted(false);
    }, 5000);
  };

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <div className={styles.contentWrapper}>
          <div className={styles.pageContent}>
            <div className={styles.dashboardHeader}>
              <div className={styles.welcomeSection}>
                <h1>Course Registration</h1>
                <p className={styles.subtitle}>Select courses for {studentRegistrationInfo.semester}</p>
              </div>
              <div className={styles.studentInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Registration Status:</span>
                  <span className={styles.value}>
                    {studentRegistrationInfo.registrationStatus === 'open' ? (
                      <span className={styles.statusOpen}>Open</span>
                    ) : (
                      <span className={styles.statusClosed}>Closed</span>
                    )}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Deadline:</span>
                  <span className={styles.value}>
                    {new Date(studentRegistrationInfo.registrationDeadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.registrationContainer}>
              {registrationSubmitted && (
                <div style={{
                  backgroundColor: '#c8e6c9',
                  border: '1px solid #81c784',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle size={20} color="#2e7d32" style={{ marginRight: '12px' }} />
                  <span style={{ color: '#2e7d32', fontWeight: '500' }}>
                    Registration submitted successfully!
                  </span>
                </div>
              )}
              
              <div className={styles.registrationSummary}>
                <h2>Registration Summary</h2>
                <div className={styles.summaryStats}>
                  <div className={styles.summaryStatItem}>
                    <div className={styles.statLabel}>Selected Courses</div>
                    <div className={styles.statValue}>{selectedCourses.length}</div>
                  </div>
                  <div className={styles.summaryStatItem}>
                    <div className={styles.statLabel}>Selected Credits</div>
                    <div className={styles.statValue}>
                      {currentCredits}/{studentRegistrationInfo.maxCredits}
                    </div>
                  </div>
                </div>
                
                <div className={styles.selectedCoursesList}>
                  <h3>Selected Courses</h3>
                  {selectedCourses.length === 0 ? (
                    <div className={styles.noCourses}>
                      <p>No courses selected yet. Browse and select courses below.</p>
                    </div>
                  ) : (
                    <div className={styles.courseList}>
                      <CustomTable 
                        headers={['Course Code', 'Course Name', 'Credits', 'Instructor', 'Action']}
                        data={selectedCourses.map(course => ({
                          'Course Code': course.code,
                          'Course Name': course.name,
                          'Credits': course.credits,
                          'Instructor': course.instructor,
                          'Action': {
                            type: 'action',
                            selected: true,
                            disabled: false
                          },
                          id: course.id
                        }))}
                        onView={handleSelectCourse}
                      />
                    </div>
                  )}
                  {selectedCourses.length > 0 && (
                    <button className={styles.submitButton} onClick={handleSubmitRegistration}>
                      Submit Registration
                    </button>
                  )}
                </div>
              </div>
              
              <div className={styles.availableCourses}>
                <div className={styles.searchContainer}>
                  <div className={styles.searchInput}>
                    <Search size={20} strokeWidth={1.5} />
                    <input
                      type="text"
                      placeholder="Search courses by code or name..."
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
                
                <div className={styles.coursesTable}>
                  <h3 style={{ marginBottom: '16px' }}>Available Courses</h3>
                  <CustomTable 
                    headers={['Course Code', 'Course Name', 'Credits', 'Instructor', 'Availability', 'Action']}
                    data={filteredCourses.map(course => ({
                      'Course Code': course.code,
                      'Course Name': course.name,
                      'Credits': course.credits,
                      'Instructor': course.instructor,
                      'Availability': {
                        type: 'availability',
                        status: course.status,
                        seats: course.seats,
                        enrolled: course.enrolled
                      },
                      'Action': {
                        type: 'action',
                        selected: selectedCourses.some(selected => selected.id === course.id),
                        disabled: course.status === 'closed' || 
                                 (currentCredits + course.credits > studentRegistrationInfo.maxCredits && 
                                  !selectedCourses.some(selected => selected.id === course.id))
                      },
                      id: course.id, // Keep original data for handlers
                      status: course.status,
                      seats: course.seats,
                      enrolled: course.enrolled
                    }))}
                    onView={handleSelectCourse} // Use view action for select/deselect
                    statusColors={{
                      open: '#C3F4D0',
                      closed: '#FFCECE'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseRegistration; 