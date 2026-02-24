import React, { useState, useEffect } from 'react';
import { Clock, FileText, BookOpen, AlertCircle, Award, BarChart2, Layers } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import styles from '../styles/pages/studentCoursesMids.module.scss';
import { useToast } from '../context/ToastContext';

const StudentCoursesMids = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('midterm'); // 'sessional', 'midterm', 'final'
  const [profile, setProfile] = useState({});
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    // Placeholder for fetching profile and marks
    const fetchData = async () => {
      try {
        setLoading(true);

        // TODO: Replace with your API calls
        const mockProfile = { rollNo: '12345', semester: '3', department: 'CSE' };
        const mockMarks = [
          {
            courseCode: 'CSE101',
            courseName: 'Introduction to CS',
            currentMarks: { marks: 45, totalMarks: 50 },
            sessionalMarks: { marks: 20, totalMarks: 25 },
            finalMarks: { marks: 80, totalMarks: 100 },
          },
          {
            courseCode: 'MAT101',
            courseName: 'Calculus I',
            currentMarks: { marks: 35, totalMarks: 50 },
            sessionalMarks: { marks: 15, totalMarks: 25 },
            finalMarks: { marks: 60, totalMarks: 100 },
          },
        ];

        setProfile(mockProfile);
        setMarks(mockMarks);
        showToast('Course marks loaded successfully', 'success');
      } catch (err) {
        setError('Failed to load course marks');
        showToast('Failed to load course marks', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    showToast(`Switched to ${activeTab} evaluations`, 'info');
  }, [activeTab, showToast]);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const calculatePerformance = (obtained, total) => {
    if (obtained === null || total === 0) return 0;
    return Math.round((obtained / total) * 100);
  };

  const getPerformanceColor = (percentage) => {
    if (percentage === null) return '#aaa';
    if (percentage >= 80) return '#2E7D32';
    if (percentage >= 70) return '#4CAF50';
    if (percentage >= 60) return '#FFC107';
    return '#F44336';
  };

  // Filter marks based on activeTab
  const filteredMarks = marks.map(course => {
    let currentMarks = course.currentMarks;
    if (activeTab === 'sessional') currentMarks = course.sessionalMarks;
    if (activeTab === 'final') currentMarks = course.finalMarks;
    return { ...course, currentMarks };
  });

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle size={48} />
        <h3>Error Loading Data</h3>
        <p>{error}</p>
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
              {filteredMarks.map(course => (
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