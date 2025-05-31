import React, { useState, useEffect } from 'react';
import { Clock, FileText, BookOpen, AlertCircle, Award, BarChart2, Layers, GraduationCap } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import styles from '../styles/pages/studentCoursesMids.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourseMarks } from '../features/courses/coursesSlice';

const StudentCoursesMids = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('mids'); // 'sessional', 'mids', 'final'

  // Mock data - would be fetched from API
  const studentData = {
    name: "John Smith",
    rollNo: "Fall 23-BSSE-123",
    department: "Software Engineering",
    semester: "Fall 2023"
  };

  // Mock evaluation data for courses
  const evaluationData = {
    sessional: [
      { 
        id: 1, 
        courseCode: 'CS301', 
        courseName: 'Database Systems',
        assignments: { obtained: 8.5, total: 10 },
        quizzes: { obtained: 12, total: 15 },
        attendance: { obtained: 4.5, total: 5 },
        total: { obtained: 25, total: 30 }
      },
      { 
        id: 2, 
        courseCode: 'CS302', 
        courseName: 'Operating Systems',
        assignments: { obtained: 7, total: 10 },
        quizzes: { obtained: 10, total: 15 },
        attendance: { obtained: 5, total: 5 },
        total: { obtained: 22, total: 30 }
      },
      { 
        id: 3, 
        courseCode: 'CS303', 
        courseName: 'Software Engineering',
        assignments: { obtained: 9, total: 10 },
        quizzes: { obtained: 13, total: 15 },
        attendance: { obtained: 5, total: 5 },
        total: { obtained: 27, total: 30 }
      },
      { 
        id: 4, 
        courseCode: 'CS304', 
        courseName: 'Computer Networks',
        assignments: { obtained: 8, total: 10 },
        quizzes: { obtained: 11, total: 15 },
        attendance: { obtained: 4, total: 5 },
        total: { obtained: 23, total: 30 }
      }
    ],
    mids: [
    { 
      id: 1, 
      courseCode: 'CS301', 
      courseName: 'Database Systems', 
      date: '2023-10-15', 
      time: '09:00 - 11:00', 
      venue: 'Block A, Room 101',
      totalMarks: 30,
      obtainedMarks: 25,
      status: 'completed',
      syllabus: ["Introduction to DBMS", "ER Diagram", "Relational Algebra", "SQL Basics", "Normalization"]
    },
    { 
      id: 2, 
      courseCode: 'CS302', 
      courseName: 'Operating Systems', 
      date: '2023-10-17', 
      time: '09:00 - 11:00', 
      venue: 'Block B, Room 203',
      totalMarks: 30,
      obtainedMarks: 22,
      status: 'completed',
      syllabus: ["Introduction to OS", "Process Management", "CPU Scheduling", "Memory Management", "File Systems"]
    },
    { 
      id: 3, 
      courseCode: 'CS303', 
      courseName: 'Software Engineering', 
      date: '2023-10-19', 
      time: '14:00 - 16:00', 
      venue: 'Block A, Room 105',
      totalMarks: 30,
      obtainedMarks: 27,
      status: 'completed',
      syllabus: ["Software Process", "Agile Methodology", "Requirements Engineering", "Software Design", "Testing Strategies"]
    },
    { 
      id: 4, 
      courseCode: 'CS304', 
      courseName: 'Computer Networks', 
      date: '2023-10-21', 
      time: '11:00 - 13:00', 
      venue: 'Block C, Room 302',
      totalMarks: 30,
      obtainedMarks: null,
      status: 'upcoming',
      syllabus: ["Network Models", "Physical Layer", "Data Link Layer", "Network Layer", "Transport Layer"]
      }
    ],
    final: [
      { 
        id: 1, 
        courseCode: 'CS301', 
        courseName: 'Database Systems',
        date: '2023-12-10', 
        time: '09:00 - 12:00', 
        venue: 'Examination Hall A',
        totalMarks: 40,
        obtainedMarks: 32,
        status: 'completed'
      },
      { 
        id: 2, 
        courseCode: 'CS302', 
        courseName: 'Operating Systems',
        date: '2023-12-15', 
        time: '09:00 - 12:00', 
        venue: 'Examination Hall B',
        totalMarks: 40,
        obtainedMarks: 34,
        status: 'completed'
      },
      { 
        id: 3, 
        courseCode: 'CS303', 
        courseName: 'Software Engineering',
        date: '2023-12-20', 
        time: '14:00 - 17:00', 
        venue: 'Examination Hall A',
        totalMarks: 40,
        obtainedMarks: 35,
        status: 'completed'
      },
      { 
        id: 4, 
        courseCode: 'CS304', 
        courseName: 'Computer Networks',
        date: '2023-12-25', 
        time: '09:00 - 12:00', 
        venue: 'Examination Hall C',
        totalMarks: 40,
        obtainedMarks: null,
        status: 'upcoming'
      }
    ]
  };

  const dispatch = useDispatch();
  const { marks: midsMarks, loading: midsLoading, error: midsError } = useSelector(state => state.courses);

  useEffect(() => {
    dispatch(fetchCourseMarks('683866e97c09d53caade320b'));
  }, [dispatch]);

  // Replace only the mids data with API data if available
  const midsData = midsMarks && midsMarks.length > 0 ? midsMarks.map((item, idx) => ({
    id: idx + 1,
    courseCode: item.courseCode,
    courseName: item.courseName,
    date: '', // API does not provide date
    time: '', // API does not provide time
    venue: '', // API does not provide venue
    totalMarks: item.totalMarks,
    obtainedMarks: item.marks,
    status: 'completed', // Assume completed if marks present
    syllabus: [] // Not provided
  })) : evaluationData.mids;

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate performance percentage
  const calculatePerformance = (obtained, total) => {
    if (obtained === null) return null;
    return Math.round((obtained / total) * 100);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return styles.statusCompleted;
      case 'upcoming': return styles.statusUpcoming;
      case 'missed': return styles.statusMissed;
      default: return '';
    }
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

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'sessional':
        return (
          <div className={styles.evaluationGrid} style={evaluationGridStyle}>
            {evaluationData.sessional.map(course => (
              <div key={course.id} className={styles.midtermCard} style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                border: '1px solid #e0e0e0',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div className={styles.midtermHeader} style={{
                  borderBottom: '1px solid #f0f0f0',
                  paddingBottom: '12px'
                }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    margin: '0 0 4px 0',
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <BookOpen size={16} />
                    {course.courseCode} - {course.courseName}
                  </h3>
                </div>
                
                <div className={styles.sessionComponents}>
                  {/* Assignments */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FileText size={16} />
                        <span>Assignments</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 'bold' }}>{course.assignments.obtained}</span>
                        /{course.assignments.total}
                        <span style={{ 
                          marginLeft: '8px',
                          color: getPerformanceColor(calculatePerformance(course.assignments.obtained, course.assignments.total)),
                          fontWeight: 'bold'
                        }}>
                          ({calculatePerformance(course.assignments.obtained, course.assignments.total)}%)
                        </span>
                      </div>
                    </div>
                    
                    <div style={{
                      height: '10px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '5px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        height: '100%',
                        width: `${calculatePerformance(course.assignments.obtained, course.assignments.total)}%`,
                        backgroundColor: getPerformanceColor(calculatePerformance(course.assignments.obtained, course.assignments.total)),
                        borderRadius: '5px',
                        transition: 'width 1s ease-in-out'
                      }}></div>
                    </div>
                  </div>
                  
                  {/* Quizzes */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertCircle size={16} />
                        <span>Quizzes</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 'bold' }}>{course.quizzes.obtained}</span>
                        /{course.quizzes.total}
                        <span style={{ 
                          marginLeft: '8px',
                          color: getPerformanceColor(calculatePerformance(course.quizzes.obtained, course.quizzes.total)),
                          fontWeight: 'bold'
                        }}>
                          ({calculatePerformance(course.quizzes.obtained, course.quizzes.total)}%)
                        </span>
                      </div>
                    </div>
                    
                    <div style={{
                      height: '10px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '5px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        height: '100%',
                        width: `${calculatePerformance(course.quizzes.obtained, course.quizzes.total)}%`,
                        backgroundColor: getPerformanceColor(calculatePerformance(course.quizzes.obtained, course.quizzes.total)),
                        borderRadius: '5px',
                        transition: 'width 1s ease-in-out'
                      }}></div>
                    </div>
                  </div>
                  
                  {/* Attendance */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={16} />
                        <span>Attendance</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 'bold' }}>{course.attendance.obtained}</span>
                        /{course.attendance.total}
                        <span style={{ 
                          marginLeft: '8px',
                          color: getPerformanceColor(calculatePerformance(course.attendance.obtained, course.attendance.total)),
                          fontWeight: 'bold'
                        }}>
                          ({calculatePerformance(course.attendance.obtained, course.attendance.total)}%)
                        </span>
                      </div>
                    </div>
                    
                    <div style={{
                      height: '10px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '5px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        height: '100%',
                        width: `${calculatePerformance(course.attendance.obtained, course.attendance.total)}%`,
                        backgroundColor: getPerformanceColor(calculatePerformance(course.attendance.obtained, course.attendance.total)),
                        borderRadius: '5px',
                        transition: 'width 1s ease-in-out'
                      }}></div>
                    </div>
                  </div>
                </div>
                
                {/* Total */}
                <div style={{
                  borderTop: '1px solid #f0f0f0',
                  paddingTop: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Total Score:</div>
                    <div>
                      <span style={{ fontWeight: 'bold' }}>{course.total.obtained}</span>
                      /{course.total.total}
                      <span style={{ 
                        marginLeft: '8px',
                        color: getPerformanceColor(calculatePerformance(course.total.obtained, course.total.total)),
                        fontWeight: 'bold'
                      }}>
                        ({calculatePerformance(course.total.obtained, course.total.total)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div style={{
                    height: '16px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      height: '100%',
                      width: `${calculatePerformance(course.total.obtained, course.total.total)}%`,
                      backgroundColor: getPerformanceColor(calculatePerformance(course.total.obtained, course.total.total)),
                      borderRadius: '8px',
                      transition: 'width 1s ease-in-out'
                    }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'mids':
        if (midsLoading) return <div>Loading...</div>;
        if (midsError) return <div style={{color: 'red'}}>Error: {midsError}</div>;
        return (
          <div className={styles.evaluationGrid} style={evaluationGridStyle}>
            {midsData.map(exam => (
              <div key={exam.id} className={styles.midtermCard} style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                border: '1px solid #e0e0e0',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div className={styles.midtermHeader} style={{
                  borderBottom: '1px solid #f0f0f0',
                  paddingBottom: '12px'
                }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    margin: '0 0 4px 0',
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <BookOpen size={16} />
                    {exam.courseCode} - {exam.courseName}
                  </h3>
                  <div style={{
                    fontSize: '14px',
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Clock size={14} />
                    <span>{exam.date}</span>
                  </div>
                </div>
                
                {exam.status === 'completed' ? (
                  <div className={styles.midtermResult}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <div style={{ fontWeight: 'bold' }}>Score:</div>
                      <div>
                        <span style={{ fontWeight: 'bold' }}>{exam.obtainedMarks}</span>
                        /{exam.totalMarks}
                        <span style={{ 
                          marginLeft: '8px',
                          color: getPerformanceColor(calculatePerformance(exam.obtainedMarks, exam.totalMarks)),
                          fontWeight: 'bold'
                        }}>
                          ({calculatePerformance(exam.obtainedMarks, exam.totalMarks)}%)
                        </span>
                      </div>
                    </div>
                    
                    <div style={{
                      height: '20px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        height: '100%',
                        width: `${calculatePerformance(exam.obtainedMarks, exam.totalMarks)}%`,
                        backgroundColor: getPerformanceColor(calculatePerformance(exam.obtainedMarks, exam.totalMarks)),
                        borderRadius: '10px',
                        transition: 'width 1s ease-in-out'
                      }}></div>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex', 
                    gap: '8px', 
                    alignItems: 'center', 
                    padding: '12px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '8px'
                  }}>
                    <AlertCircle size={18} color="#f57c00" />
                    <span style={{ color: '#f57c00', fontSize: '14px' }}>Upcoming exam</span>
                  </div>
                )}
                
                <div className={styles.venueLine} style={{
                  fontSize: '14px',
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <FileText size={14} />
                  <span>{exam.venue}</span>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'final':
        return (
          <div className={styles.evaluationGrid} style={evaluationGridStyle}>
            {evaluationData.final.map(exam => (
              <div key={exam.id} className={styles.midtermCard} style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                border: '1px solid #e0e0e0',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div className={styles.midtermHeader} style={{
                  borderBottom: '1px solid #f0f0f0',
                  paddingBottom: '12px'
                }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    margin: '0 0 4px 0',
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Award size={16} />
                    {exam.courseCode} - {exam.courseName}
                  </h3>
                  <div style={{
                    fontSize: '14px',
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      <span>{exam.date}</span>
                    </div>
                    <div style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      backgroundColor: exam.status === 'completed' ? '#e8f5e9' : '#fff8e1',
                      color: exam.status === 'completed' ? '#2E7D32' : '#f57c00'
                    }}>
                      {exam.status === 'completed' ? 'Completed' : 'Upcoming'}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666' }}>
                  <FileText size={14} />
                  <span>{exam.venue}</span>
                </div>
                
                {exam.status === 'completed' ? (
                  <div className={styles.finalResult}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <div style={{ fontWeight: 'bold' }}>Score:</div>
                      <div>
                        <span style={{ fontWeight: 'bold' }}>{exam.obtainedMarks}</span>
                        /{exam.totalMarks}
                        <span style={{ 
                          marginLeft: '8px',
                          color: getPerformanceColor(calculatePerformance(exam.obtainedMarks, exam.totalMarks)),
                          fontWeight: 'bold'
                        }}>
                          ({calculatePerformance(exam.obtainedMarks, exam.totalMarks)}%)
                        </span>
                      </div>
                    </div>
                    
                    <div style={{
                      height: '20px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        height: '100%',
                        width: `${calculatePerformance(exam.obtainedMarks, exam.totalMarks)}%`,
                        backgroundColor: getPerformanceColor(calculatePerformance(exam.obtainedMarks, exam.totalMarks)),
                        borderRadius: '10px',
                        transition: 'width 1s ease-in-out'
                      }}></div>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex', 
                    gap: '8px', 
                    alignItems: 'center', 
                    padding: '12px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '8px'
                  }}>
                    <GraduationCap size={18} />
                    <span style={{ color: '#666', fontSize: '14px' }}>Final exam not conducted yet</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
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
                <h1>Academic Evaluations</h1>
                <p className={styles.subtitle}>View your academic performance and results</p>
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

            <div className={styles.tabsContainer} style={{
              display: 'flex',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <button 
                onClick={() => setActiveTab('sessional')}
                className={`${styles.tabButton} ${activeTab === 'sessional' ? styles.active : ''}`}
                style={{
                  flex: 1,
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: activeTab === 'sessional' ? 'rgba(46, 125, 50, 0.1)' : 'transparent',
                  color: activeTab === 'sessional' ? '#1B5E20' : '#666',
                  border: 'none',
                  borderBottom: activeTab === 'sessional' ? '3px solid #1B5E20' : 'none',
                  fontWeight: activeTab === 'sessional' ? 'bold' : 'normal',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Layers size={18} />
                <span>Sessional</span>
              </button>
              <button 
                onClick={() => setActiveTab('mids')}
                className={`${styles.tabButton} ${activeTab === 'mids' ? styles.active : ''}`}
                style={{
                  flex: 1,
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: activeTab === 'mids' ? 'rgba(46, 125, 50, 0.1)' : 'transparent',
                  color: activeTab === 'mids' ? '#1B5E20' : '#666',
                  border: 'none',
                  borderBottom: activeTab === 'mids' ? '3px solid #1B5E20' : 'none',
                  fontWeight: activeTab === 'mids' ? 'bold' : 'normal',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <BarChart2 size={18} />
                <span>Mid Term</span>
                      </button>
              <button 
                onClick={() => setActiveTab('final')}
                className={`${styles.tabButton} ${activeTab === 'final' ? styles.active : ''}`}
                style={{
                  flex: 1,
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: activeTab === 'final' ? 'rgba(46, 125, 50, 0.1)' : 'transparent',
                  color: activeTab === 'final' ? '#1B5E20' : '#666',
                  border: 'none',
                  borderBottom: activeTab === 'final' ? '3px solid #1B5E20' : 'none',
                  fontWeight: activeTab === 'final' ? 'bold' : 'normal',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Award size={18} />
                <span>Final Term</span>
                      </button>
            </div>

            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCoursesMids; 