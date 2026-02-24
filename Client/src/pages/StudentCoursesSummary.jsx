import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import CustomTable from '../components/common/CustomTable';
import styles from '../styles/pages/studentCoursesSummary.module.scss';
import { useToast } from '../context/ToastContext';

const StudentCoursesSummary = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with your API calls
        const mockProfile = {
          rollNo: '12345',
          semester: '3',
          enrolledCourses: [
            { course: 'cse101' },
            { course: 'mat101' }
          ]
        };

        const mockSummaries = {
          cse101: {
            courseCode: 'CSE101',
            courseName: 'Introduction to CS',
            instructor: 'Dr. Smith',
            attendanceRate: 85,
            totalLectures: 20,
            presentLectures: 17,
            absentLectures: 3
          },
          mat101: {
            courseCode: 'MAT101',
            courseName: 'Calculus I',
            instructor: 'Prof. Jones',
            attendanceRate: 78,
            totalLectures: 18,
            presentLectures: 14,
            absentLectures: 4
          }
        };

        const mockDetails = {
          cse101: [
            { title: 'Arrays', date: '2026-02-20T10:00:00Z', status: 'Present' },
            { title: 'Loops', date: '2026-02-21T10:00:00Z', status: 'Absent' }
          ],
          mat101: [
            { title: 'Limits', date: '2026-02-19T09:00:00Z', status: 'Present' },
            { title: 'Derivatives', date: '2026-02-21T09:00:00Z', status: 'Present' }
          ]
        };

        setProfile(mockProfile);
        setSummaries(mockSummaries);
        setDetails(mockDetails);

        showToast('Profile and attendance data loaded', 'success');
      } catch (err) {
        setError('Failed to load data');
        showToast('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

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
      showToast(`Viewing attendance for ${course.code}`, 'info');
    } else {
      showToast(`No attendance records found for ${course.code}`, 'error');
    }
  };

  const coursesData = profile?.enrolledCourses?.map(enrollment => {
    const summary = summaries[enrollment.course] || {};
    return {
      id: enrollment.course,
      code: summary.courseCode || enrollment.course,
      name: summary.courseName || 'N/A',
      instructor: summary.instructor || 'N/A',
      attendance: summary.attendanceRate || 0,
      totalLectures: summary.totalLectures || 0,
      presentLectures: summary.presentLectures || 0,
      absentLectures: summary.absentLectures || 0
    };
  }) || [];

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
      <div className={styles.decorativeWave}></div>
      <div className={styles.decorativeTriangle}></div>
      <div className={styles.decorativeCircle}></div>

      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
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

            <div className={styles.tableSection}>
              <h2>Courses Overview</h2>
              <CustomTable
                headers={['Code', 'Course Name', 'Attendance', 'Total Lectures', 'Present', 'Absent', 'Actions']}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCoursesSummary;