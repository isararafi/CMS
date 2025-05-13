import React, { useState } from 'react';
import { Clock, FileText, BookOpen, AlertCircle, Award, CheckCircle } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import CustomTable from '../components/common/CustomTable';
import styles from '../styles/pages/courseRegistration.module.scss';

const CourseRegistration = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);

  // Mock student data
  const studentData = {
    name: "John Smith",
    rollNo: "Fall 23-BSSE-123",
    department: "Software Engineering",
    semester: "Fall 2023"
  };

  // Mock courses data with availability
  const coursesData = [
    {
      id: 1,
      code: 'CS301',
      name: 'Database Systems',
      creditHours: 3,
      instructor: 'Dr. Smith',
      availability: {
        type: 'availability',
        status: 'open',
        seats: 40,
        enrolled: 35
      },
      action: {
        type: 'action',
        selected: false,
        disabled: false
      },
      status: registrationSubmitted ? 'Approved' : '-'
    },
    {
      id: 2,
      code: 'CS302',
      name: 'Operating Systems',
      creditHours: 3,
      instructor: 'Dr. Johnson',
      availability: {
        type: 'availability',
        status: 'open',
        seats: 45,
        enrolled: 40
      },
      action: {
        type: 'action',
        selected: false,
        disabled: false
      },
      status: registrationSubmitted ? 'Rejected' : '-'
    },
    {
      id: 3,
      code: 'CS303',
      name: 'Software Engineering',
      creditHours: 3,
      instructor: 'Dr. Williams',
      availability: {
        type: 'availability',
        status: 'closed',
        seats: 35,
        enrolled: 35
      },
      action: {
        type: 'action',
        selected: false,
        disabled: true
      },
      status: '-'
    },
    {
      id: 4,
      code: 'CS304',
      name: 'Computer Networks',
      creditHours: 3,
      instructor: 'Dr. Brown',
      availability: {
        type: 'availability',
        status: 'open',
        seats: 50,
        enrolled: 42
      },
      action: {
        type: 'action',
        selected: false,
        disabled: false
      },
      status: registrationSubmitted ? 'Approved' : '-'
    }
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleCourseSelect = (course) => {
    const updatedCourses = coursesData.map(c => {
      if (c.id === course.id) {
        return {
          ...c,
          action: {
            ...c.action,
            selected: !c.action.selected
          }
        };
      }
      return c;
    });

    setSelectedCourses(updatedCourses.filter(c => c.action.selected));
  };

  const handleSubmitRegistration = () => {
    setRegistrationSubmitted(true);
    // Here you would typically make an API call to submit the registration
    console.log("Selected courses:", selectedCourses);
  };

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
        <Navbar toggleSidebar={toggleSidebar} />
        
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
                  <span className={styles.value}>{studentData.rollNo}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Semester:</span>
                  <span className={styles.value}>{studentData.semester}</span>
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

              <CustomTable 
                headers={['Code', 'Course Name', 'Credit Hours', 'Instructor', 'Availability', 'Action', 'Status']}
                data={coursesData}
                onView={handleCourseSelect}
                statusColors={{
                  'Approved': '#C3F4D0',
                  'Rejected': '#FFCECE',
                  '-': '#f0f0f0'
                }}
              />

              <div className={styles.registrationActions}>
                <button 
                  className={styles.submitButton}
                  onClick={handleSubmitRegistration}
                  disabled={selectedCourses.length === 0 || registrationSubmitted}
                >
                  {registrationSubmitted ? (
                    <>
                      <CheckCircle size={16} />
                      Registration Submitted
                    </>
                  ) : (
                    'Submit Registration'
                  )}
                </button>
              </div>

              {registrationSubmitted && (
                <div className={styles.registrationStatus}>
                  <h3>Registration Status</h3>
                  <p>Your course registration has been submitted. Check the status column for results.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseRegistration; 