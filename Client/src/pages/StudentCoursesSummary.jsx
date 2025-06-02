import React, { useState, useEffect } from 'react';
import { Clock, FileText, BookOpen, AlertCircle, Award, BarChart2, PieChart, Layers, X, User, MapPin, Calendar } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import CustomTable from '../components/common/CustomTable';
import styles from '../styles/pages/studentCoursesSummary.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceSummary, fetchAttendanceDetailed } from '../features/courses/attendanceSlice';
import { fetchStudentProfile } from '../features/student/studentProfileSlice';
import { useToast } from '../context/ToastContext';

const StudentCoursesSummary = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAttendanceDetail, setSelectedAttendanceDetail] = useState(null);

  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { profile } = useSelector(state => state.studentProfile || {});
  const { summaries, details, loading, error } = useSelector(state => state.attendance || {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchStudentProfile()).unwrap();
        showToast('Profile data loaded successfully', 'success');
      } catch (error) {
        showToast(error.message || 'Failed to load profile data', 'error');
      }
    };
    
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (profile?.enrolledCourses) {
        try {
          await Promise.all(profile.enrolledCourses.map(async course => {
            await dispatch(fetchAttendanceSummary(course.course)).unwrap();
            await dispatch(fetchAttendanceDetailed(course.course)).unwrap();
          }));
          showToast('Attendance data loaded successfully', 'success');
        } catch (error) {
          showToast('Failed to load attendance data for some courses', 'error');
        }
      }
    };

    fetchAttendanceData();
  }, [dispatch]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId === selectedCourse ? null : courseId);
  };

  // View attendance handler
  const handleViewAttendance = (course) => {
    const courseDetails = details[course.id];
    if (courseDetails) {
      setSelectedAttendance({
        courseName: course.name,
        courseCode: course.code,
        records: courseDetails.map(record => ({
          topic: record.title,
          date: new Date(record.date).toLocaleDateString(),
          time: new Date(record.date).toLocaleTimeString(),
          status: record.status
        }))
      });
      setShowAttendanceModal(true);
      showToast(`Viewing attendance for ${course.code}`, 'info');
    } else {
      showToast(`No attendance records found for ${course.code}`, 'error');
    }
  };

  // Close modal handler
  const handleCloseModal = () => {
    setShowAttendanceModal(false);
    setSelectedAttendance(null);
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

  // Prepare course data from API responses
  const coursesData = profile?.enrolledCourses?.map(enrollment => {
    const summary = summaries[enrollment.course] || {};
    return {
      id: enrollment.course,
      code: summary.courseCode, // You might want to map this to a proper course code
      name: summary.courseName, // You might want to fetch course names separately
      instructor: summary.instructor, // You might want to fetch instructor names separately
      attendance: summary.attendanceRate || 0,
      totalLectures: summary.totalLectures || 0,
      presentLectures: summary.presentLectures || 0,
      absentLectures: summary.absentLectures || 0
    };
  }) || [];

  // Show loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  // Show error state
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
        {/* <Navbar toggleSidebar={toggleSidebar} /> */}
        
        <div className={styles.contentWrapper}>
          <div className={styles.pageContent}>
            <div className={styles.dashboardHeader}>
              <div className={styles.welcomeSection}>
                <h1>Course Summary</h1>
                <p className={styles.subtitle}>View your academic performance across courses</p>
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

            {/* Custom Table */}
            <div className={styles.tableSection}>
              <h2>Courses Overview</h2>
              <CustomTable 
                headers={['Code', 'Course Name',  'Attendance', 'Total Lectures', 'Present', 'Absent', 'Actions']}
                data={coursesData.map(course => ({
                  code: course.code,
                  'Course Name': course.name,
                  attendance: `${Math.round(course.attendance)}%`,
                  'Total Lectures': course.totalLectures,
                  Present: course.presentLectures,
                  Absent: course.absentLectures,
                  id: course.id,
                  actions: { view: true }
                }))}
                onView={handleViewAttendance}
              />
            </div>

            {/* Attendance Modal */}
            {showAttendanceModal && selectedAttendance && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <button className={styles.modalClose} onClick={handleCloseModal}>
                    <X size={24} />
                  </button>
                  
                  <h2>{selectedAttendance.courseCode} - {selectedAttendance.courseName} Attendance</h2>
                  
                  <CustomTable 
                    headers={['Topic', 'Date', 'Time', 'Status']}
                    data={selectedAttendance.records}
                    showActionColumn={false}
                    statusColors={{
                      Present: '#C3F4D0',
                      Absent: '#FFCECE',
                      Pending: '#FFE9C0'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCoursesSummary; 