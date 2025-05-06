import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Clock, BarChart2, CheckCircle, Calendar, ChevronRight, Info, AlertCircle } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import styles from '../styles/pages/dashboard.module.scss';
import courseStyles from '../styles/pages/course-index.module.scss';

const StudentCoursesIndex = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data - would be fetched from API
  const studentData = {
    name: "John Smith",
    rollNo: "Fall 23-BSSE-123",
    department: "Software Engineering",
    semester: "Fall 2023"
  };

  const coursesData = [
    { 
      id: 1, 
      code: 'CS301', 
      name: 'Database Systems', 
      instructor: 'Dr. Smith',
      totalClasses: 32,
      attendedClasses: 28,
      attendance: 87.5,
      obtainedMarks: 76,
      totalMarks: 100,
      pendingAssignments: 1,
      upcomingQuiz: { date: '2023-11-28', topic: 'Normalization' },
      progressStatus: 'on-track'
    },
    { 
      id: 2, 
      code: 'CS302', 
      name: 'Operating Systems', 
      instructor: 'Dr. Johnson',
      totalClasses: 30,
      attendedClasses: 25,
      attendance: 83.33,
      obtainedMarks: 65,
      totalMarks: 100,
      pendingAssignments: 0,
      upcomingQuiz: null,
      progressStatus: 'warning'
    },
    { 
      id: 3, 
      code: 'CS303', 
      name: 'Software Engineering', 
      instructor: 'Dr. Williams',
      totalClasses: 28,
      attendedClasses: 26,
      attendance: 92.86,
      obtainedMarks: 82,
      totalMarks: 100,
      pendingAssignments: 1,
      upcomingQuiz: { date: '2023-12-05', topic: 'Software Testing' },
      progressStatus: 'on-track'
    },
    { 
      id: 4, 
      code: 'CS304', 
      name: 'Computer Networks', 
      instructor: 'Dr. Brown',
      totalClasses: 26,
      attendedClasses: 22,
      attendance: 84.62,
      obtainedMarks: 70,
      totalMarks: 100,
      pendingAssignments: 2,
      upcomingQuiz: { date: '2023-11-30', topic: 'Network Security' },
      progressStatus: 'warning'
    }
  ];

  // Course navigation options
  const courseNavOptions = [
    { id: 'summary', name: 'Course Summary', icon: <Info size={18} />, path: '/student-courses-summary' },
    { id: 'proceedings', name: 'Class Proceedings', icon: <BookOpen size={18} />, path: '/student-courses-proceedings' },
    { id: 'assignments', name: 'Assignments', icon: <FileText size={18} />, path: '/student-assignments' },
    { id: 'mids', name: 'Mid-Term Exams', icon: <BarChart2 size={18} />, path: '/student-courses-mids' },
    { id: 'finals', name: 'Final Exams', icon: <CheckCircle size={18} />, path: '/student-result' }
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to get progress status class
  const getStatusClass = (status) => {
    switch(status) {
      case 'on-track': return courseStyles.statusOnTrack;
      case 'warning': return courseStyles.statusWarning;
      case 'at-risk': return courseStyles.statusAtRisk;
      default: return '';
    }
  };

  // Helper function to get progress status text
  const getStatusText = (status) => {
    switch(status) {
      case 'on-track': return 'On Track';
      case 'warning': return 'Needs Attention';
      case 'at-risk': return 'At Risk';
      default: return status;
    }
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
                <h1>My Courses</h1>
                <p className={styles.subtitle}>Manage and track all your enrolled courses</p>
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

            <div className={courseStyles.courseNavigationSection}>
              <div className={courseStyles.navigationTitle}>
                <h2>Course Navigation</h2>
              </div>
              <div className={courseStyles.navigationCards}>
                {courseNavOptions.map(option => (
                  <Link to={option.path} key={option.id} className={courseStyles.navCard}>
                    <div className={courseStyles.navIcon}>
                      {option.icon}
                    </div>
                    <div className={courseStyles.navTitle}>{option.name}</div>
                    <ChevronRight size={18} className={courseStyles.navArrow} />
                  </Link>
                ))}
              </div>
            </div>

            <div className={courseStyles.enrolledCoursesSection}>
              <div className={courseStyles.sectionTitle}>
                <h2>Enrolled Courses</h2>
                <span className={courseStyles.courseCount}>{coursesData.length} courses</span>
              </div>
              
              <div className={courseStyles.coursesList}>
                {coursesData.map(course => (
                  <div key={course.id} className={courseStyles.courseCard}>
                    <div className={courseStyles.courseHeader}>
                      <div className={courseStyles.courseInfo}>
                        <div className={courseStyles.courseCode}>
                          {course.code}
                        </div>
                        <h3 className={courseStyles.courseName}>
                          {course.name}
                        </h3>
                        <div className={courseStyles.courseInstructor}>
                          Instructor: {course.instructor}
                        </div>
                      </div>
                      
                      <div className={courseStyles.courseProgress}>
                        <div className={courseStyles.progressCircle}>
                          <svg width="80" height="80" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="#e6e6e6"
                              strokeWidth="10"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="#2E7D32"
                              strokeWidth="10"
                              strokeDasharray={`${2 * Math.PI * 45 * course.obtainedMarks / course.totalMarks} ${2 * Math.PI * 45}`}
                              strokeDashoffset={2 * Math.PI * 45 * 0.25}
                            />
                          </svg>
                          <div className={courseStyles.progressText}>
                            {course.obtainedMarks}%
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={courseStyles.courseStats}>
                      <div className={courseStyles.statItem}>
                        <div className={courseStyles.statLabel}>
                          <Clock size={16} />
                          <span>Attendance</span>
                        </div>
                        <div className={courseStyles.statValue}>
                          {course.attendance.toFixed(1)}%
                        </div>
                        <div className={courseStyles.statDetail}>
                          {course.attendedClasses}/{course.totalClasses} classes
                        </div>
                      </div>
                      
                      <div className={courseStyles.statItem}>
                        <div className={courseStyles.statLabel}>
                          <FileText size={16} />
                          <span>Assignments</span>
                        </div>
                        <div className={courseStyles.statValue}>
                          {course.pendingAssignments}
                        </div>
                        <div className={courseStyles.statDetail}>
                          pending
                        </div>
                      </div>
                      
                      <div className={courseStyles.statItem}>
                        <div className={courseStyles.statLabel}>
                          <Calendar size={16} />
                          <span>Next Quiz</span>
                        </div>
                        {course.upcomingQuiz ? (
                          <>
                            <div className={courseStyles.statValue}>
                              {formatDate(course.upcomingQuiz.date)}
                            </div>
                            <div className={courseStyles.statDetail}>
                              {course.upcomingQuiz.topic}
                            </div>
                          </>
                        ) : (
                          <div className={courseStyles.statValue}>None</div>
                        )}
                      </div>
                    </div>
                    
                    <div className={courseStyles.courseFooter}>
                      <div className={`${courseStyles.courseStatus} ${getStatusClass(course.progressStatus)}`}>
                        <div className={courseStyles.statusDot}></div>
                        <span>{getStatusText(course.progressStatus)}</span>
                      </div>
                      
                      <div className={courseStyles.courseActions}>
                        <Link to={`/student-courses-summary?course=${course.id}`} className={courseStyles.viewButton}>
                          View Course
                        </Link>
                      </div>
                    </div>
                    
                    {course.progressStatus === 'warning' && (
                      <div className={courseStyles.warningMessage}>
                        <AlertCircle size={16} />
                        <span>Your attendance or marks need improvement in this course.</span>
                      </div>
                    )}
                    
                    {course.progressStatus === 'at-risk' && (
                      <div className={courseStyles.warningMessage}>
                        <AlertCircle size={16} />
                        <span>You are at risk of failing this course. Please meet with your instructor.</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCoursesIndex; 