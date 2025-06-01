import React, { useState, useEffect } from 'react';
import { Clock, FileText, BookOpen, AlertCircle, Award, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import CustomTable from '../components/common/CustomTable';
import styles from '../styles/pages/courseRegistration.module.scss';
import { fetchAvailableCourses, registerCourses, toggleCourseSelection, clearRegistrationStatus } from '../features/courses/courseRegistrationSlice';
import { fetchStudentProfile } from '../features/student/studentProfileSlice';

const CourseRegistration = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dispatch = useDispatch();
  
  const { 
    availableCourses, 
    selectedCourses, 
    loading, 
    registrationLoading, 
    error, 
    registrationError,
    registrationSuccess,
    successMessage 
  } = useSelector(state => state.courseRegistration);
  
  const { profile } = useSelector(state => state.studentProfile);

  useEffect(() => {
    dispatch(fetchAvailableCourses());
    dispatch(fetchStudentProfile());
  }, [dispatch]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleCourseSelect = (course) => {
    dispatch(toggleCourseSelection(course.id));
  };

  const handleSubmitRegistration = () => {
    if (selectedCourses.length > 0) {
      dispatch(registerCourses(selectedCourses));
    }
  };

  // Transform available courses data for the table
  const coursesData = availableCourses.map(course => ({
    id: course._id,
    code: course.courseCode,
    courseName: course.courseName,
    // name: course.courseName,
    creditHours: course.creditHours,
    department: course.department,
    instructor: course.instructor?.name || 'TBA',
    availability: {
      type: 'availability',
      status: course.seats > course.enrolled ? 'open' : 'closed',
      seats: course.seats,
      enrolled: course.enrolled
    },
    action: {
      type: 'action',
      selected: selectedCourses.includes(course._id),
      disabled: course.seats <= course.enrolled
    }
  }));

  // Show loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

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
        {/* <Navbar toggleSidebar={toggleSidebar} /> */}
        
        <div className={styles.contentWrapper}>
          <div className={styles.pageContent}>
            <div className={styles.dashboardHeader}>
              <div className={styles.welcomeSection}>
                <h1>Course Registration</h1>
                <p className={styles.subtitle}>Select courses for the upcoming semester</p>
              </div>
              <div className={styles.studentInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Roll No:</span>
                  <span className={styles.value}>{profile?.rollNo || 'N/A'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Semester:</span>
                  <span className={styles.value}>{profile?.semester || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className={styles.registrationSection}>
              <div className={styles.registrationHeader}>
                <h2>Available Courses</h2>
                <div className={styles.selectedCount}>
                  Selected: {selectedCourses.length} courses
                </div>
              </div>

              {error && (
                <div className={styles.errorMessage}>
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <CustomTable 
                headers={['Code', 'Course Name', 'Credit Hours', 'Department' , 'Action']}
                data={coursesData}
                onView={handleCourseSelect}
              />

              <div className={styles.registrationActions}>
                {registrationError && (
                  <div className={styles.errorMessage}>
                    <AlertCircle size={16} />
                    {registrationError}
                  </div>
                )}

                {registrationSuccess && (
                  <div className={styles.successMessage}>
                    <CheckCircle size={16} />
                    {successMessage}
                  </div>
                )}

                <button 
                  className={styles.submitButton}
                  onClick={handleSubmitRegistration}
                  disabled={selectedCourses.length === 0 || registrationLoading}
                >
                  {registrationLoading ? (
                    'Registering...'
                  ) : registrationSuccess ? (
                    <>
                      <CheckCircle size={16} />
                      Registration Submitted
                    </>
                  ) : (
                    'Submit Registration'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseRegistration; 