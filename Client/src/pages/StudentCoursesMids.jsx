import React, { useState } from 'react';
import { Clock, FileText, BookOpen, AlertCircle, Download } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import styles from '../styles/pages/dashboard.module.scss';

const StudentCoursesMids = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data - would be fetched from API
  const studentData = {
    name: "John Smith",
    rollNo: "Fall 23-BSSE-123",
    department: "Software Engineering",
    semester: "Fall 2023"
  };

  const midsData = [
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
    },
  ];

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

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <div className={styles.contentWrapper}>
          <div className={styles.pageContent}>
            <div className={styles.dashboardHeader}>
              <div className={styles.welcomeSection}>
                <h1>Mid-Term Examinations</h1>
                <p className={styles.subtitle}>View your mid-term exam details and results</p>
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

            <div className={styles.statsContainer}>
              {midsData.map(exam => (
                <div key={exam.id} className={`${styles.examCard} ${getStatusColor(exam.status)}`}>
                  <div className={styles.examHeader}>
                    <div className={styles.courseInfo}>
                      <h3 className={styles.courseCode}>{exam.courseCode}</h3>
                      <p className={styles.courseName}>{exam.courseName}</p>
                    </div>
                    <div className={`${styles.examStatus} ${getStatusColor(exam.status)}`}>
                      {exam.status === 'completed' && 'Completed'}
                      {exam.status === 'upcoming' && 'Upcoming'}
                      {exam.status === 'missed' && 'Missed'}
                    </div>
                  </div>
                  
                  <div className={styles.examDetails}>
                    <div className={styles.examDetailItem}>
                      <Clock size={16} />
                      <span>{exam.date} | {exam.time}</span>
                    </div>
                    <div className={styles.examDetailItem}>
                      <FileText size={16} />
                      <span>{exam.venue}</span>
                    </div>
                  </div>
                  
                  {exam.status === 'completed' && (
                    <div className={styles.examResult}>
                      <div className={styles.examScore}>
                        <div className={styles.scoreCircle}>
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
                              strokeDasharray={`${2 * Math.PI * 45 * calculatePerformance(exam.obtainedMarks, exam.totalMarks) / 100} ${2 * Math.PI * 45}`}
                              strokeDashoffset={2 * Math.PI * 45 * 0.25}
                            />
                          </svg>
                          <div className={styles.scoreText}>
                            {exam.obtainedMarks}/{exam.totalMarks}
                          </div>
                        </div>
                      </div>
                      <div className={styles.examMarks}>
                        <div className={styles.markItem}>
                          <span className={styles.markLabel}>Obtained</span>
                          <span className={styles.markValue}>{exam.obtainedMarks}</span>
                        </div>
                        <div className={styles.markItem}>
                          <span className={styles.markLabel}>Total</span>
                          <span className={styles.markValue}>{exam.totalMarks}</span>
                        </div>
                        <div className={styles.markItem}>
                          <span className={styles.markLabel}>Percentage</span>
                          <span className={styles.markValue}>{calculatePerformance(exam.obtainedMarks, exam.totalMarks)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {exam.status === 'upcoming' && (
                    <div className={styles.examCountdown}>
                      <AlertCircle size={20} />
                      <span>Prepare for your upcoming exam. Review the syllabus below.</span>
                    </div>
                  )}
                  
                  <div className={styles.examSyllabus}>
                    <h4 className={styles.syllabusTitle}>Syllabus Coverage</h4>
                    <ul className={styles.syllabusList}>
                      {exam.syllabus.map((topic, index) => (
                        <li key={index} className={styles.syllabusItem}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={styles.examActions}>
                    {exam.status === 'completed' ? (
                      <button className={styles.examActionButton}>
                        <Download size={16} />
                        <span>Download Mid Paper</span>
                      </button>
                    ) : (
                      <button className={styles.examActionButton}>
                        <BookOpen size={16} />
                        <span>Study Material</span>
                      </button>
                    )}
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