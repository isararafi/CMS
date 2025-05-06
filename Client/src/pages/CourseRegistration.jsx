import React, { useState } from 'react';
import { BookOpenCheck, CheckCircle, AlertCircle, Search } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import styles from '../styles/pages/dashboard.module.scss';

const CourseRegistration = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);

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
    // Check if course is already selected
    if (selectedCourses.some(selected => selected.id === course.id)) {
      setSelectedCourses(selectedCourses.filter(selected => selected.id !== course.id));
      return;
    }

    // Check if course is closed
    if (course.status === 'closed') {
      return;
    }

    // Check if adding this course would exceed max credits
    const currentCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);
    if (currentCredits + course.credits > studentRegistrationInfo.maxCredits) {
      return;
    }

    setSelectedCourses([...selectedCourses, course]);
  };

  const currentCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);

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
                      {selectedCourses.map(course => (
                        <div key={course.id} className={styles.selectedCourseItem}>
                          <div className={styles.courseInfo}>
                            <div className={styles.courseCode}>{course.code}</div>
                            <div className={styles.courseName}>{course.name}</div>
                          </div>
                          <div className={styles.courseCredits}>{course.credits} Credits</div>
                          <button
                            className={styles.removeButton}
                            onClick={() => handleSelectCourse(course)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedCourses.length > 0 && (
                    <button className={styles.submitButton}>
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
                  <div className={styles.tableHeader}>
                    <div className={styles.thCode}>Course Code</div>
                    <div className={styles.thName}>Course Name</div>
                    <div className={styles.thCredits}>Credits</div>
                    <div className={styles.thInstructor}>Instructor</div>
                    <div className={styles.thAvailability}>Availability</div>
                    <div className={styles.thAction}>Action</div>
                  </div>
                  
                  <div className={styles.tableBody}>
                    {filteredCourses.map(course => (
                      <div 
                        key={course.id} 
                        className={`${styles.tableRow} ${
                          course.status === 'closed' ? styles.disabledRow : ''
                        } ${
                          selectedCourses.some(selected => selected.id === course.id) ? styles.selectedRow : ''
                        }`}
                      >
                        <div className={styles.tdCode}>{course.code}</div>
                        <div className={styles.tdName}>{course.name}</div>
                        <div className={styles.tdCredits}>{course.credits}</div>
                        <div className={styles.tdInstructor}>{course.instructor}</div>
                        <div className={styles.tdAvailability}>
                          {course.status === 'open' ? (
                            <span className={styles.availabilityOpen}>
                              <span className={styles.seatsInfo}>
                                {course.seats - course.enrolled} / {course.seats}
                              </span>
                            </span>
                          ) : (
                            <span className={styles.availabilityClosed}>
                              <AlertCircle size={16} strokeWidth={1.5} />
                              <span className={styles.seatsInfo}>Full</span>
                            </span>
                          )}
                        </div>
                        <div className={styles.tdAction}>
                          {selectedCourses.some(selected => selected.id === course.id) ? (
                            <button
                              className={styles.selectedButton}
                              onClick={() => handleSelectCourse(course)}
                            >
                              <CheckCircle size={16} strokeWidth={1.5} />
                              Selected
                            </button>
                          ) : (
                            <button
                              className={`${styles.selectButton} ${
                                course.status === 'closed' || 
                                (currentCredits + course.credits > studentRegistrationInfo.maxCredits) ? 
                                styles.disabledButton : ''
                              }`}
                              onClick={() => handleSelectCourse(course)}
                              disabled={
                                course.status === 'closed' || 
                                (currentCredits + course.credits > studentRegistrationInfo.maxCredits)
                              }
                            >
                              Select
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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