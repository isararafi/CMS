import React, { useState, useEffect } from 'react';
import { Clock, FileText, BookOpen, AlertCircle, Award, CheckCircle } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import CustomTable from '../components/common/CustomTable';
import styles from '../styles/pages/courseRegistration.module.scss';
import { useToast } from '../context/ToastContext';

const CourseRegistration = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]); // Course data
  const [selectedCourses, setSelectedCourses] = useState([]); // Selected course IDs
  const [loading, setLoading] = useState(true);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registrationError, setRegistrationError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [profile, setProfile] = useState({}); // Student profile

  const { showToast } = useToast();

  useEffect(() => {
    // Placeholder for fetching courses and profile
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // TODO: Replace below with your API calls
        const mockProfile = { rollNo: '12345', semester: '3' };
        const mockCourses = [
          { _id: 'c1', courseCode: 'CSE101', courseName: 'Intro to CS', creditHours: 3, department: 'CSE', instructor: { name: 'Dr. Smith' }, seats: 30, enrolled: 10 },
          { _id: 'c2', courseCode: 'MAT101', courseName: 'Calculus I', creditHours: 4, department: 'Math', instructor: { name: 'Dr. Johnson' }, seats: 25, enrolled: 25 },
        ];

        setProfile(mockProfile);
        setAvailableCourses(mockCourses);
        showToast('Available courses loaded successfully', 'success');
      } catch (err) {
        setError('Failed to load courses');
        showToast('Failed to load courses', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourses(prev => {
      if (prev.includes(courseId)) {
        showToast('Course removed from selection', 'info');
        return prev.filter(id => id !== courseId);
      } else {
        if (prev.length >= 6) {
          showToast('Cannot select more than 6 courses', 'error');
          return prev;
        }
        showToast('Course added to selection', 'success');
        return [...prev, courseId];
      }
    });
  };

  const handleSubmitRegistration = async () => {
    try {
      setRegistrationLoading(true);
      setRegistrationError(null);
      setRegistrationSuccess(false);

      // TODO: Replace below with your API call
      if (selectedCourses.length > 0) {
        console.log('Registering courses:', selectedCourses);
        setTimeout(() => {
          setRegistrationSuccess(true);
          setSuccessMessage('Course registration submitted successfully');
          showToast('Course registration submitted successfully', 'success');
        }, 1000);
      }
    } catch (err) {
      setRegistrationError('Failed to submit course registration');
      showToast('Failed to submit course registration', 'error');
    } finally {
      setRegistrationLoading(false);
    }
  };

  const coursesData = availableCourses.map(course => ({
    id: course._id,
    code: course.courseCode,
    courseName: course.courseName,
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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardLayout}>
      <div className={styles.decorativeWave}></div>
      <div className={styles.decorativeTriangle}></div>
      <div className={styles.decorativeCircle}></div>
      <div className={styles.decorativeDots}></div>
      <div className={styles.decorativeDiamond}></div>

      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
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
                headers={['Code', 'Course Name', 'Credit Hours', 'Department', 'Action']}
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
                  {registrationLoading ? 'Registering...' :
                   registrationSuccess ? (
                     <>
                       <CheckCircle size={16} />
                       Registration Submitted
                     </>
                   ) : 'Submit Registration'}
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