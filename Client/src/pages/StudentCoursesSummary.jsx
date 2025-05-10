import React, { useState } from 'react';
import { Clock, FileText, BookOpen, AlertCircle, Award, BarChart2, PieChart, Layers, X, User, MapPin, Calendar } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import CustomTable from '../components/common/CustomTable';
import styles from '../styles/pages/dashboard.module.scss';

const StudentCoursesSummary = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAttendanceDetail, setSelectedAttendanceDetail] = useState(null);

  // Mock data - would be fetched from API
  const studentData = {
    name: "John Smith",
    rollNo: "Fall 23-BSSE-123",
    department: "Software Engineering",
    semester: "Fall 2023"
  };

  // Mock courses data
  const coursesData = [
    { 
      id: 1, 
      code: 'CS301', 
      name: 'Database Systems', 
      instructor: 'Dr. Smith',
      attendance: 92,
      midTerm: 25,
      assignments: 88,
      quizzes: 80,
      finalExam: null,
      totalObtained: 76,
      totalOutOf: 100
    },
    { 
      id: 2, 
      code: 'CS302', 
      name: 'Operating Systems', 
      instructor: 'Dr. Johnson',
      attendance: 88,
      midTerm: 22,
      assignments: 75,
      quizzes: 70,
      finalExam: null,
      totalObtained: 65,
      totalOutOf: 100
    },
    { 
      id: 3, 
      code: 'CS303', 
      name: 'Software Engineering', 
      instructor: 'Dr. Williams',
      attendance: 95,
      midTerm: 27,
      assignments: 92,
      quizzes: 85,
      finalExam: null,
      totalObtained: 82,
      totalOutOf: 100
    },
    { 
      id: 4, 
      code: 'CS304', 
      name: 'Computer Networks', 
      instructor: 'Dr. Brown',
      attendance: 90,
      midTerm: null,
      assignments: 85,
      quizzes: 78,
      finalExam: null,
      totalObtained: 70,
      totalOutOf: 100
    }
  ];

  // Mock attendance data
  const attendanceData = [
    {
      courseId: 1,
      attendanceRecords: [
        { date: "Nov 24, 2023", time: "10:00 AM", status: "Present", topic: "Relational Database Design" },
        { date: "Nov 24, 2023", time: "9:00 AM", status: "Absent", topic: "SQL Queries and Joins" },
        { date: "Aug 25, 2023", time: "9:00 AM", status: "Absent", topic: "Database Indexing" },
        { date: "Jul 23, 2023", time: "9:00 AM", status: "Pending", topic: "Transaction Management" }
      ]
    },
    {
      courseId: 2,
      attendanceRecords: [
        { date: "Nov 22, 2023", time: "11:00 AM", status: "Present", topic: "Deadlock Prevention Strategies" },
        { date: "Nov 15, 2023", time: "11:00 AM", status: "Present", topic: "Memory Management" },
        { date: "Nov 8, 2023", time: "11:00 AM", status: "Absent", topic: "Virtual Memory" }
      ]
    },
    {
      courseId: 3,
      attendanceRecords: [
        { date: "Nov 23, 2023", time: "2:00 PM", status: "Present", topic: "Agile Development Methodologies" },
        { date: "Nov 16, 2023", time: "2:00 PM", status: "Present", topic: "Requirements Engineering" },
        { date: "Nov 9, 2023", time: "2:00 PM", status: "Present", topic: "Software Architecture" }
      ]
    },
    {
      courseId: 4,
      attendanceRecords: [
        { date: "Nov 24, 2023", time: "9:00 AM", status: "Pending", topic: "Network Protocols" },
        { date: "Nov 17, 2023", time: "9:00 AM", status: "Present", topic: "OSI Model" }
      ]
    }
  ];

  // Mock attendance details data
  const attendanceDetailsData = [
    {
      date: "Nov 24, 2023",
      time: "10:00 AM",
      details: {
        courseCode: "CS301",
        courseName: "Database Systems",
        instructor: "Dr. Smith",
        classroom: "Room 405, Building B",
        duration: "1 hour 30 minutes",
        topic: "Relational Database Design",
        notes: "Covered normalization forms and ER diagrams",
        markedBy: "Dr. Smith at 10:15 AM",
        previousAttendance: [
          { date: "Nov 17, 2023", status: "Present", topic: "SQL Queries and Joins" },
          { date: "Nov 10, 2023", status: "Present", topic: "Database Indexing" },
          { date: "Nov 3, 2023", status: "Absent", topic: "Transaction Management" },
          { date: "Oct 27, 2023", status: "Present", topic: "ACID Properties" },
          { date: "Oct 20, 2023", status: "Present", topic: "NoSQL Databases" }
        ]
      }
    },
    {
      date: "Nov 24, 2023",
      time: "9:00 AM",
      details: {
        courseCode: "CS302",
        courseName: "Operating Systems",
        instructor: "Dr. Johnson",
        classroom: "Room 201, Building A",
        duration: "1 hour 30 minutes",
        topic: "Process Scheduling Algorithms",
        notes: "Covered FCFS, SJF, and Round Robin scheduling",
        markedBy: "TA Michael at 9:05 AM",
        previousAttendance: [
          { date: "Nov 17, 2023", status: "Present", topic: "Memory Management" },
          { date: "Nov 10, 2023", status: "Present", topic: "Virtual Memory" },
          { date: "Nov 3, 2023", status: "Present", topic: "File Systems" },
          { date: "Oct 27, 2023", status: "Absent", topic: "I/O Systems" },
          { date: "Oct 20, 2023", status: "Present", topic: "Deadlocks" }
        ]
      }
    },
    {
      date: "Nov 22, 2023",
      time: "11:00 AM",
      details: {
        courseCode: "CS302",
        courseName: "Operating Systems",
        instructor: "Dr. Johnson",
        classroom: "Room 201, Building A",
        duration: "1 hour 30 minutes",
        topic: "Deadlock Prevention Strategies",
        notes: "Discussed prevention, avoidance, detection, and recovery",
        markedBy: "Dr. Johnson at 11:10 AM",
        previousAttendance: [
          { date: "Nov 15, 2023", status: "Present", topic: "Synchronization" },
          { date: "Nov 8, 2023", status: "Present", topic: "Semaphores and Mutexes" },
          { date: "Nov 1, 2023", status: "Absent", topic: "Process Communication" },
          { date: "Oct 25, 2023", status: "Present", topic: "CPU Scheduling" },
          { date: "Oct 18, 2023", status: "Present", topic: "System Calls" }
        ]
      }
    },
    {
      date: "Nov 23, 2023",
      time: "2:00 PM",
      details: {
        courseCode: "CS303",
        courseName: "Software Engineering",
        instructor: "Dr. Williams",
        classroom: "Room 305, Building C",
        duration: "1 hour 30 minutes",
        topic: "Agile Development Methodologies",
        notes: "Focus on Scrum and Kanban practices",
        markedBy: "Dr. Williams at 2:05 PM",
        previousAttendance: [
          { date: "Nov 16, 2023", status: "Present", topic: "Requirements Engineering" },
          { date: "Nov 9, 2023", status: "Present", topic: "Software Architecture" },
          { date: "Nov 2, 2023", status: "Present", topic: "Design Patterns" },
          { date: "Oct 26, 2023", status: "Present", topic: "Testing Strategies" },
          { date: "Oct 19, 2023", status: "Present", topic: "Version Control Systems" }
        ]
      }
    }
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId === selectedCourse ? null : courseId);
  };

  // View attendance handler
  const handleViewAttendance = (course) => {
    console.log("handleViewAttendance called with course:", course);
    const attendance = attendanceData.find(a => a.courseId === course.id);
    console.log("Found attendance data:", attendance);
    
    if (attendance) {
      setSelectedAttendance({
        courseName: course.name,
        courseCode: course.code,
        records: attendance.attendanceRecords
      });
      setShowAttendanceModal(true);
      console.log("Modal should be showing now, showAttendanceModal:", true);
    } else {
      console.log("No attendance data found for course ID:", course.id);
    }
  };

  // Cancel attendance handler
  const handleCancelAttendance = (record) => {
    // In a real app, you would call an API to cancel the attendance
    console.log("Cancelling attendance:", record);
    // Then you might refresh the data
  };

  // Close modal handler
  const handleCloseModal = () => {
    setShowAttendanceModal(false);
    setSelectedAttendance(null);
  };

  // Calculate performance percentage
  const calculatePerformance = (obtained, total) => {
    if (obtained === null) return null;
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

  // Prepare table data
  const tableData = coursesData.map(course => ({
    id: course.id,
    code: course.code,
    'Course Name': course.name,
    instructor: course.instructor,
    attendance: `${course.attendance}%`,
    midTerm: course.midTerm ? `${course.midTerm}/30` : 'N/A',
    finalExam: course.finalExam ? `${course.finalExam}/40` : 'Not conducted',
    totalMarks: `${course.totalObtained}/${course.totalOutOf}`,
    actions: { view: true }
  }));

  // Add summary card styles
  const summaryGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    padding: '8px 4px'
  };

  // Modal styles
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: showAttendanceModal ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1050
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '80vh',
    overflow: 'auto',
    position: 'relative',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
  };

  const modalCloseStyle = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  // Handler for viewing attendance details
  const handleViewAttendanceDetails = (record) => {
    // Find attendance details
    const details = attendanceDetailsData.find(
      item => item.date === record.date && item.time === record.time
    );
    
    if (details) {
      setSelectedAttendanceDetail(details);
      setShowDetailsModal(true);
    } else {
      // Fallback if no details found
      setSelectedAttendanceDetail({
        date: record.date,
        time: record.time,
        details: {
          courseCode: selectedAttendance.courseCode,
          courseName: selectedAttendance.courseName,
          instructor: "Information not available",
          classroom: "Information not available",
          duration: "Information not available",
          topic: record.topic || "Information not available",
          notes: "No additional notes",
          markedBy: "System",
          previousAttendance: [
            { date: "Nov 15, 2023", status: "Present", topic: "Previous Lecture 1" },
            { date: "Nov 8, 2023", status: "Present", topic: "Previous Lecture 2" },
            { date: "Nov 1, 2023", status: "Absent", topic: "Previous Lecture 3" },
            { date: "Oct 25, 2023", status: "Present", topic: "Previous Lecture 4" }
          ]
        }
      });
      setShowDetailsModal(true);
    }
  };
  
  // Close details modal handler
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedAttendanceDetail(null);
  };

  // Details modal styles
  const detailsModalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: showDetailsModal ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1060 // Higher than the attendance modal
  };

  const detailsModalContentStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    width: '90%',
    maxWidth: '550px',
    position: 'relative',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
  };

  const detailItemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '12px',
    padding: '8px 0',
    borderBottom: '1px solid #f0f0f0'
  };

  const detailIconStyle = {
    marginRight: '16px',
    color: '#525F7F'
  };

  const detailLabelStyle = {
    fontWeight: 'bold',
    minWidth: '100px',
    color: '#525F7F'
  };

  const detailValueStyle = {
    flex: 1,
    color: '#333'
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
                <h1>Course Summary</h1>
                <p className={styles.subtitle}>View your academic performance across courses</p>
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

            {/* Custom Table */}
            <div className={styles.tableSection} style={{ marginBottom: '24px' }}>
              <h2 style={{ marginBottom: '16px', fontSize: '18px' }}>Courses Overview</h2>
              <CustomTable 
                headers={['Code', 'Course Name', 'Instructor', 'Attendance', 'Mid Term', 'Final Exam', 'Total Marks', 'Actions']}
                data={coursesData.map(course => ({
                  code: course.code,
                  'Course Name': course.name,
                  instructor: course.instructor,
                  attendance: `${course.attendance}%`,
                  midTerm: course.midTerm ? `${course.midTerm}/30` : 'N/A',
                  finalExam: course.finalExam ? `${course.finalExam}/40` : 'Not conducted',
                  totalMarks: `${course.totalObtained}/${course.totalOutOf}`,
                  id: course.id, // Keep this for the handler
                  actions: { view: true }
                }))}
                onView={handleViewAttendance}
              />
            </div>

            <h2 style={{ marginBottom: '16px', fontSize: '18px' }}>Detailed Course Cards</h2>
            <div style={summaryGridStyle}>
              {coursesData.map(course => (
                <div 
                  key={course.id} 
                  className={styles.courseCard}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    border: selectedCourse === course.id ? '2px solid #2E7D32' : '1px solid #e0e0e0',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    transform: selectedCourse === course.id ? 'translateY(-4px)' : 'none'
                  }}
                  onClick={() => handleCourseSelect(course.id)}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    borderBottom: '1px solid #f0f0f0',
                    paddingBottom: '12px'
                  }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      margin: '0',
                      color: '#2E7D32',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <BookOpen size={16} />
                      {course.code}
                    </h3>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: getPerformanceColor(calculatePerformance(course.totalObtained, course.totalOutOf))
                    }}>
                      {course.totalObtained}
                      <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#666' }}>/{course.totalOutOf}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '16px', marginBottom: '4px', color: '#333' }}>
                    {course.name}
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '16px', color: '#666' }}>
                    {course.instructor}
                  </div>

                  <div style={{
                    height: '8px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      position: 'absolute',
                      height: '100%',
                      width: `${(course.totalObtained / course.totalOutOf) * 100}%`,
                      backgroundColor: getPerformanceColor(calculatePerformance(course.totalObtained, course.totalOutOf)),
                      borderRadius: '4px'
                    }}></div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '13px',
                      color: '#666'
                    }}>
                      <Clock size={14} />
                      <span>{course.attendance}%</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '13px',
                      color: '#666'
                    }}>
                      <FileText size={14} />
                      <span>{course.assignments}%</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '13px',
                      color: '#666'
                    }}>
                      <Award size={14} />
                      <span>{course.midTerm ? `${course.midTerm}/30` : 'N/A'}</span>
                    </div>
                  </div>

                  {selectedCourse === course.id && (
                    <div style={{
                      marginTop: '16px',
                      borderTop: '1px solid #f0f0f0',
                      paddingTop: '16px'
                    }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Detailed Performance</h4>
                      
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '4px'
                        }}>
                          <div style={{ fontSize: '14px' }}>Attendance</div>
                          <div style={{ 
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: getPerformanceColor(course.attendance)
                          }}>
                            {course.attendance}%
                          </div>
                        </div>
                        <div style={{
                          height: '6px',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          position: 'relative'
                        }}>
                          <div style={{
                            position: 'absolute',
                            height: '100%',
                            width: `${course.attendance}%`,
                            backgroundColor: getPerformanceColor(course.attendance),
                            borderRadius: '3px'
                          }}></div>
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '4px'
                        }}>
                          <div style={{ fontSize: '14px' }}>Assignments</div>
                          <div style={{ 
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: getPerformanceColor(course.assignments)
                          }}>
                            {course.assignments}%
                          </div>
                        </div>
                        <div style={{
                          height: '6px',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          position: 'relative'
                        }}>
                          <div style={{
                            position: 'absolute',
                            height: '100%',
                            width: `${course.assignments}%`,
                            backgroundColor: getPerformanceColor(course.assignments),
                            borderRadius: '3px'
                          }}></div>
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '4px'
                        }}>
                          <div style={{ fontSize: '14px' }}>Quizzes</div>
                          <div style={{ 
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: getPerformanceColor(course.quizzes)
                          }}>
                            {course.quizzes}%
                          </div>
                        </div>
                        <div style={{
                          height: '6px',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          position: 'relative'
                        }}>
                          <div style={{
                            position: 'absolute',
                            height: '100%',
                            width: `${course.quizzes}%`,
                            backgroundColor: getPerformanceColor(course.quizzes),
                            borderRadius: '3px'
                          }}></div>
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '4px'
                        }}>
                          <div style={{ fontSize: '14px' }}>Mid Term</div>
                          <div style={{ 
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: course.midTerm ? getPerformanceColor((course.midTerm / 30) * 100) : '#aaa'
                          }}>
                            {course.midTerm ? `${course.midTerm}/30` : 'N/A'}
                          </div>
                        </div>
                        {course.midTerm && (
                          <div style={{
                            height: '6px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '3px',
                            overflow: 'hidden',
                            position: 'relative'
                          }}>
                            <div style={{
                              position: 'absolute',
                              height: '100%',
                              width: `${(course.midTerm / 30) * 100}%`,
                              backgroundColor: getPerformanceColor((course.midTerm / 30) * 100),
                              borderRadius: '3px'
                            }}></div>
                          </div>
                        )}
                      </div>
                      
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '4px'
                        }}>
                          <div style={{ fontSize: '14px' }}>Final Exam</div>
                          <div style={{ 
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: course.finalExam ? getPerformanceColor((course.finalExam / 40) * 100) : '#aaa'
                          }}>
                            {course.finalExam ? `${course.finalExam}/40` : 'Not conducted'}
                          </div>
                        </div>
                        {course.finalExam && (
                          <div style={{
                            height: '6px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '3px',
                            overflow: 'hidden',
                            position: 'relative'
                          }}>
                            <div style={{
                              position: 'absolute',
                              height: '100%',
                              width: `${(course.finalExam / 40) * 100}%`,
                              backgroundColor: getPerformanceColor((course.finalExam / 40) * 100),
                              borderRadius: '3px'
                            }}></div>
                          </div>
                        )}
                      </div>
                      
                      <div style={{ 
                        marginTop: '16px',
                        borderTop: '1px solid #f0f0f0', 
                        paddingTop: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Overall</div>
                        <div style={{ 
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: getPerformanceColor(calculatePerformance(course.totalObtained, course.totalOutOf))
                        }}>
                          {course.totalObtained}/{course.totalOutOf} ({calculatePerformance(course.totalObtained, course.totalOutOf)}%)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {coursesData.length === 0 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
              }}>
                <BookOpen size={48} stroke="#666" strokeWidth={1} />
                <h3 style={{ margin: '16px 0 8px', color: '#333' }}>No courses found</h3>
                <p style={{ margin: 0, color: '#666' }}>No registered courses for the current semester</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Modal */}
      <div style={modalOverlayStyle}>
        <div style={modalContentStyle}>
          <button style={modalCloseStyle} onClick={handleCloseModal}>
            <X size={24} />
          </button>
          
          {selectedAttendance && (
            <>
              <h2 style={{ marginBottom: '16px', fontSize: '20px' }}>
                {selectedAttendance.courseCode} - {selectedAttendance.courseName} Attendance
              </h2>
              
              <CustomTable 
                headers={['Topic', 'Date', 'Time', 'Status']}
                data={selectedAttendance.records.map(record => ({
                  'Topic': record.topic,
                  'Date': record.date,
                  'Time': record.time,
                  'Status': record.status
                }))}
                onView={handleViewAttendanceDetails}
                showActionColumn={false}
                statusColors={{
                  Present: '#C3F4D0',
                  Absent: '#FFCECE',
                  Pending: '#FFE9C0'
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Attendance Details Modal */}
      <div style={detailsModalOverlayStyle}>
        <div style={detailsModalContentStyle}>
          <button style={modalCloseStyle} onClick={handleCloseDetailsModal}>
            <X size={24} />
          </button>
          
          {selectedAttendanceDetail && (
            <>
              <h2 style={{ marginBottom: '20px', fontSize: '20px', color: '#2E7D32' }}>
                Attendance Details
              </h2>

              <div style={{ marginBottom: '16px' }}>
                <div style={detailItemStyle}>
                  <Calendar style={detailIconStyle} size={20} />
                  <span style={detailLabelStyle}>Date & Time:</span>
                  <span style={detailValueStyle}>
                    {selectedAttendanceDetail.date} at {selectedAttendanceDetail.time}
                  </span>
                </div>

                <div style={detailItemStyle}>
                  <BookOpen style={detailIconStyle} size={20} />
                  <span style={detailLabelStyle}>Course:</span>
                  <span style={detailValueStyle}>
                    {selectedAttendanceDetail.details.courseCode} - {selectedAttendanceDetail.details.courseName}
                  </span>
                </div>

                <div style={detailItemStyle}>
                  <User style={detailIconStyle} size={20} />
                  <span style={detailLabelStyle}>Instructor:</span>
                  <span style={detailValueStyle}>
                    {selectedAttendanceDetail.details.instructor}
                  </span>
                </div>

                <div style={detailItemStyle}>
                  <MapPin style={detailIconStyle} size={20} />
                  <span style={detailLabelStyle}>Location:</span>
                  <span style={detailValueStyle}>
                    {selectedAttendanceDetail.details.classroom}
                  </span>
                </div>

                <div style={detailItemStyle}>
                  <Clock style={detailIconStyle} size={20} />
                  <span style={detailLabelStyle}>Duration:</span>
                  <span style={detailValueStyle}>
                    {selectedAttendanceDetail.details.duration}
                  </span>
                </div>

                <div style={detailItemStyle}>
                  <FileText style={detailIconStyle} size={20} />
                  <span style={detailLabelStyle}>Topic:</span>
                  <span style={detailValueStyle}>
                    {selectedAttendanceDetail.details.topic}
                  </span>
                </div>

                <div style={detailItemStyle}>
                  <AlertCircle style={detailIconStyle} size={20} />
                  <span style={detailLabelStyle}>Notes:</span>
                  <span style={detailValueStyle}>
                    {selectedAttendanceDetail.details.notes}
                  </span>
                </div>

                <div style={detailItemStyle}>
                  <User style={detailIconStyle} size={20} />
                  <span style={detailLabelStyle}>Marked by:</span>
                  <span style={detailValueStyle}>
                    {selectedAttendanceDetail.details.markedBy}
                  </span>
                </div>
              </div>

              {/* Previous Attendance History */}
              {selectedAttendanceDetail.details.previousAttendance && (
                <div>
                  <h3 style={{ 
                    fontSize: '16px', 
                    color: '#525F7F', 
                    marginBottom: '12px',
                    borderBottom: '1px solid #e0e0e0',
                    paddingBottom: '8px'
                  }}>
                    Previous Lecture Attendance
                  </h3>
                  
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px',
                    marginBottom: '16px'
                  }}>
                    <thead>
                      <tr style={{
                        backgroundColor: '#f5f7fa',
                        borderBottom: '1px solid #e0e0e0'
                      }}>
                        <th style={{
                          textAlign: 'left',
                          padding: '8px',
                          fontWeight: '600',
                          color: '#525F7F'
                        }}>Date</th>
                        <th style={{
                          textAlign: 'left',
                          padding: '8px',
                          fontWeight: '600',
                          color: '#525F7F'
                        }}>Status</th>
                        <th style={{
                          textAlign: 'left',
                          padding: '8px',
                          fontWeight: '600',
                          color: '#525F7F'
                        }}>Topic</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedAttendanceDetail.details.previousAttendance.map((item, index) => (
                        <tr key={index} style={{
                          borderBottom: '1px solid #f0f0f0'
                        }}>
                          <td style={{ padding: '8px' }}>{item.date}</td>
                          <td style={{ padding: '8px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: item.status === 'Present' ? '#C3F4D0' : '#FFCECE',
                              color: item.status === 'Present' ? '#2E7D32' : '#E53935'
                            }}>
                              {item.status}
                            </span>
                          </td>
                          <td style={{ padding: '8px' }}>{item.topic}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Attendance Statistics */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px',
                    backgroundColor: '#f9fbfd',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#525F7F', fontSize: '13px' }}>Total Classes</div>
                      <div style={{ fontSize: '16px', color: '#333' }}>
                        {selectedAttendanceDetail.details.previousAttendance.length + 1}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#525F7F', fontSize: '13px' }}>Present</div>
                      <div style={{ fontSize: '16px', color: '#2E7D32' }}>
                        {selectedAttendanceDetail.details.previousAttendance.filter(a => a.status === 'Present').length + 1}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#525F7F', fontSize: '13px' }}>Absent</div>
                      <div style={{ fontSize: '16px', color: '#E53935' }}>
                        {selectedAttendanceDetail.details.previousAttendance.filter(a => a.status === 'Absent').length}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#525F7F', fontSize: '13px' }}>Attendance %</div>
                      <div style={{ fontSize: '16px', color: '#333' }}>
                        {Math.round(((selectedAttendanceDetail.details.previousAttendance.filter(a => a.status === 'Present').length + 1) / 
                                    (selectedAttendanceDetail.details.previousAttendance.length + 1)) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCoursesSummary; 