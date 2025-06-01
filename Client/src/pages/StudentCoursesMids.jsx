import React, { useState, useEffect } from 'react';
import { Clock, FileText, BookOpen, AlertCircle, Award, BarChart2, Layers, GraduationCap } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import styles from '../styles/pages/studentCoursesMids.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllCourseMarks, setActiveType } from '../features/courses/courseMarksSlice';
import { fetchStudentProfile } from '../features/student/studentProfileSlice';

const StudentCoursesMids = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('midterm'); // 'sessional', 'midterm', 'final'

  const dispatch = useDispatch();
  const { filteredMarks, loading: marksLoading, error: marksError } = useSelector(state => state.courseMarks || {});
  const { profile, loading: profileLoading, error: profileError } = useSelector(state => state.studentProfile || {});

  useEffect(() => {
    dispatch(fetchAllCourseMarks());
    dispatch(fetchStudentProfile());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setActiveType(activeTab));
  }, [activeTab, dispatch]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Calculate performance percentage
  const calculatePerformance = (obtained, total) => {
    if (obtained === null || total === 0) return null;
    return Math.round((obtained / total) * 100);
  };

  // Get performance color
  const getPerformanceColor = (percentage) => {
    if (percentage === null) return '#aaa';
    if (percentage >= 80) return '#2E7D32';
    if (percentage >= 70) return '#4CAF50';
    if (percentage >= 60) return '#FFC107';
    return '#F44336';
  };

  // Add evaluation grid styles
  const evaluationGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    padding: '8px 4px'
  };

  // Render loading state
  if (marksLoading || profileLoading) {
        return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
          </div>
        );
  }
      
  // Render error state
  if (marksError || profileError) {
        return (
      <div style={{color: 'red', padding: '20px'}}>
        Error: {marksError || profileError}
          </div>
        );
    }

  return (
    <div className={styles.dashboardLayout}>
      {/* Decorative elements */}
      <div className={styles.decorativeWave}></div>
      <div className={styles.decorativeTriangle}></div>
      <div className={styles.decorativeCircle}></div>
      
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <div className={styles.contentWrapper}>
          <div className={styles.pageContent}>
            <div className={styles.dashboardHeader}>
              <div className={styles.welcomeSection}>
                <h1>Academic Evaluations</h1>
                <p className={styles.subtitle}>View your academic performance and results</p>
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
                <div className={styles.infoItem}>
                  <span className={styles.label}>Department:</span>
                  <span className={styles.value}>{profile?.department || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className={styles.tabsContainer}>
              <button 
                onClick={() => setActiveTab('sessional')}
                className={`${styles.tabButton} ${activeTab === 'sessional' ? styles.active : ''}`}
              >
                <Layers size={18} />
                <span>Sessional</span>
              </button>
              <button 
                onClick={() => setActiveTab('midterm')}
                className={`${styles.tabButton} ${activeTab === 'midterm' ? styles.active : ''}`}
              >
                <BarChart2 size={18} />
                <span>Mid Term</span>
                      </button>
              <button 
                onClick={() => setActiveTab('final')}
                className={`${styles.tabButton} ${activeTab === 'final' ? styles.active : ''}`}
              >
                <Award size={18} />
                <span>Final Term</span>
                      </button>
            </div>

            <div className={styles.evaluationGrid}>
              {(filteredMarks || []).map(course => (
                <div key={course.courseCode} className={styles.midtermCard}>
                  <div className={styles.midtermHeader}>
                    <h3>
                      <BookOpen size={16} />
                      {course.courseCode} - {course.courseName}
                    </h3>
                  </div>
                  
                  <div className={styles.midtermResult}>
                    <div className={styles.scoreHeader}>
                      <div className={styles.scoreLabel}>Score:</div>
                      <div className={styles.scoreValue}>
                        <span style={{ fontWeight: 'bold' }}>{course.currentMarks.marks}</span>
                        /{course.currentMarks.totalMarks}
                        <span style={{ 
                          marginLeft: '8px',
                          color: getPerformanceColor(calculatePerformance(course.currentMarks.marks, course.currentMarks.totalMarks)),
                          fontWeight: 'bold'
                        }}>
                          ({calculatePerformance(course.currentMarks.marks, course.currentMarks.totalMarks)}%)
                        </span>
                      </div>
                    </div>
                    
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progress}
                        style={{
                          width: `${calculatePerformance(course.currentMarks.marks, course.currentMarks.totalMarks)}%`,
                          backgroundColor: getPerformanceColor(calculatePerformance(course.currentMarks.marks, course.currentMarks.totalMarks))
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCoursesMids; 