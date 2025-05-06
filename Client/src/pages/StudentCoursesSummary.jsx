import React, { useState } from 'react';
import { BookOpen, Award, Clock, BarChart2, FileText, Download, ExternalLink } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip
} from 'recharts';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import styles from '../styles/pages/dashboard.module.scss';

const StudentCoursesSummary = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

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
      attendance: 92,
      midTerm: 25,
      assignments: 88,
      quizzes: 80,
      finalExam: null,
      totalObtained: 76,
      totalOutOf: 100,
      assessmentDistribution: [
        { name: 'Attendance', value: 10 },
        { name: 'Assignments', value: 20 },
        { name: 'Quizzes', value: 15 },
        { name: 'Mid Term', value: 25 },
        { name: 'Final Exam', value: 30 }
      ],
      skills: [
        { subject: 'SQL', A: 90 },
        { subject: 'Database Design', A: 85 },
        { subject: 'Normalization', A: 75 },
        { subject: 'Query Optimization', A: 70 },
        { subject: 'Transaction Management', A: 65 }
      ],
      assignments: [
        { id: 1, title: 'ER Diagram', marks: '18/20', status: 'submitted' },
        { id: 2, title: 'SQL Queries', marks: '17/20', status: 'submitted' },
        { id: 3, title: 'Database Design', marks: '19/20', status: 'submitted' }
      ]
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
      totalOutOf: 100,
      assessmentDistribution: [
        { name: 'Attendance', value: 10 },
        { name: 'Assignments', value: 15 },
        { name: 'Quizzes', value: 15 },
        { name: 'Mid Term', value: 30 },
        { name: 'Final Exam', value: 30 }
      ],
      skills: [
        { subject: 'Process Management', A: 80 },
        { subject: 'Memory Management', A: 75 },
        { subject: 'File Systems', A: 65 },
        { subject: 'CPU Scheduling', A: 70 },
        { subject: 'Synchronization', A: 60 }
      ],
      assignments: [
        { id: 1, title: 'Process Scheduling', marks: '16/20', status: 'submitted' },
        { id: 2, title: 'Memory Allocation', marks: '14/20', status: 'submitted' },
        { id: 3, title: 'File System Implementation', marks: '15/20', status: 'submitted' }
      ]
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
      totalOutOf: 100,
      assessmentDistribution: [
        { name: 'Attendance', value: 5 },
        { name: 'Assignments', value: 25 },
        { name: 'Quizzes', value: 10 },
        { name: 'Mid Term', value: 30 },
        { name: 'Final Exam', value: 30 }
      ],
      skills: [
        { subject: 'Requirements Engineering', A: 95 },
        { subject: 'Software Design', A: 90 },
        { subject: 'Testing', A: 80 },
        { subject: 'Project Management', A: 85 },
        { subject: 'Agile Methodologies', A: 75 }
      ],
      assignments: [
        { id: 1, title: 'SRS Document', marks: '19/20', status: 'submitted' },
        { id: 2, title: 'Design Patterns', marks: '18/20', status: 'submitted' },
        { id: 3, title: 'Test Cases', marks: '19/20', status: 'submitted' }
      ]
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
      totalOutOf: 100,
      assessmentDistribution: [
        { name: 'Attendance', value: 10 },
        { name: 'Assignments', value: 20 },
        { name: 'Quizzes', value: 10 },
        { name: 'Mid Term', value: 30 },
        { name: 'Final Exam', value: 30 }
      ],
      skills: [
        { subject: 'Network Architecture', A: 80 },
        { subject: 'Protocols', A: 75 },
        { subject: 'Routing', A: 70 },
        { subject: 'Network Security', A: 65 },
        { subject: 'Wireless Networks', A: 60 }
      ],
      assignments: [
        { id: 1, title: 'Network Topology', marks: '17/20', status: 'submitted' },
        { id: 2, title: 'Protocol Analysis', marks: '16/20', status: 'submitted' },
        { id: 3, title: 'Router Configuration', marks: 'N/A', status: 'pending' }
      ]
    }
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course.id === selectedCourse ? null : course.id);
  };

  const selectedCourseData = selectedCourse ? coursesData.find(course => course.id === selectedCourse) : null;

  // Prepare data for Pie Chart
  const COLORS = ['#4caf50', '#ff9800', '#2196f3', '#f44336', '#9c27b0'];

  // Calculate percentage for each assessment
  const getPercentage = (course, assessmentType) => {
    switch(assessmentType) {
      case 'Attendance': 
        return Math.round(course.attendance / 100 * course.assessmentDistribution.find(a => a.name === 'Attendance').value);
      case 'Assignments': 
        return Math.round(course.assignments / 100 * course.assessmentDistribution.find(a => a.name === 'Assignments').value);
      case 'Quizzes': 
        return Math.round(course.quizzes / 100 * course.assessmentDistribution.find(a => a.name === 'Quizzes').value);
      case 'Mid Term': 
        return course.midTerm ? Math.round(course.midTerm / 30 * course.assessmentDistribution.find(a => a.name === 'Mid Term').value) : 0;
      case 'Final Exam': 
        return course.finalExam ? Math.round(course.finalExam / 50 * course.assessmentDistribution.find(a => a.name === 'Final Exam').value) : 0;
      default: return 0;
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
                <h1>Course Summary</h1>
                <p className={styles.subtitle}>Track your performance across all courses</p>
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

            <div className={styles.courseSummaryContainer}>
              <div className={styles.coursesOverview}>
                {coursesData.map(course => (
                  <div 
                    key={course.id} 
                    className={`${styles.courseCard} ${selectedCourse === course.id ? styles.selected : ''}`}
                    onClick={() => handleCourseSelect(course)}
                  >
                    <div className={styles.courseHeader}>
                      <h3 className={styles.courseCode}>{course.code}</h3>
                      <div className={styles.courseScore}>
                        <span>{course.totalObtained}</span>
                        <small>/{course.totalOutOf}</small>
                      </div>
                    </div>
                    <div className={styles.courseName}>{course.name}</div>
                    <div className={styles.courseInstructor}>{course.instructor}</div>
                    
                    <div className={styles.courseProgressBar}>
                      <div 
                        className={styles.courseProgressFill} 
                        style={{ width: `${(course.totalObtained / course.totalOutOf) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className={styles.courseStats}>
                      <div className={styles.courseStat}>
                        <Clock size={16} />
                        <span>{course.attendance}%</span>
                      </div>
                      <div className={styles.courseStat}>
                        <FileText size={16} />
                        <span>{course.assignments}%</span>
                      </div>
                      <div className={styles.courseStat}>
                        <Award size={16} />
                        <span>{course.midTerm ? `${course.midTerm}/30` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedCourseData && (
                <div className={styles.courseDetailView}>
                  <div className={styles.courseDetailHeader}>
                    <div>
                      <h2 className={styles.detailCourseCode}>{selectedCourseData.code}</h2>
                      <h3 className={styles.detailCourseName}>{selectedCourseData.name}</h3>
                      <p className={styles.detailCourseInstructor}>Instructor: {selectedCourseData.instructor}</p>
                    </div>
                    <div className={styles.detailPerformance}>
                      <div className={styles.performanceCircle}>
                        <svg width="100" height="100" viewBox="0 0 100 100">
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
                            strokeDasharray={`${2 * Math.PI * 45 * selectedCourseData.totalObtained / selectedCourseData.totalOutOf} ${2 * Math.PI * 45}`}
                            strokeDashoffset={2 * Math.PI * 45 * 0.25}
                          />
                        </svg>
                        <div className={styles.performanceText}>
                          {selectedCourseData.totalObtained}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.courseDetailContent}>
                    <div className={styles.detailSection}>
                      <h3 className={styles.sectionTitle}>Assessment Distribution</h3>
                      <div className={styles.assessmentChart}>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={selectedCourseData.assessmentDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {selectedCourseData.assessmentDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend layout="vertical" verticalAlign="middle" align="right" />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className={styles.detailSection}>
                      <h3 className={styles.sectionTitle}>Skills Analysis</h3>
                      <div className={styles.skillsChart}>
                        <ResponsiveContainer width="100%" height={300}>
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={selectedCourseData.skills}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#666' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar name="Skills" dataKey="A" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.5} />
                            <Legend />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className={styles.detailSection}>
                      <h3 className={styles.sectionTitle}>Assignments</h3>
                      <div className={styles.assignmentsList}>
                        {selectedCourseData.assignments.map(assignment => (
                          <div key={assignment.id} className={styles.assignmentItem}>
                            <div className={styles.assignmentTitle}>{assignment.title}</div>
                            <div className={styles.assignmentMarks}>{assignment.marks}</div>
                            <div className={`${styles.assignmentStatus} ${styles[`status${assignment.status}`]}`}>
                              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                            </div>
                            <button className={styles.viewButton}>
                              <ExternalLink size={16} />
                              <span>View</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className={styles.detailActions}>
                      <button className={styles.reportButton}>
                        <Download size={16} />
                        <span>Download Report</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {!selectedCourseData && (
                <div className={styles.noSelectionView}>
                  <BookOpen size={48} strokeWidth={1} />
                  <h3>Select a course to view detailed summary</h3>
                  <p>Click on any course card to see detailed performance analysis</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCoursesSummary; 