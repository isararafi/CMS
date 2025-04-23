import React, { useState } from 'react';
import { Calendar, BookOpen, Award, Clock, BarChart2, FileText } from 'lucide-react';
import styles from '../styles/pages/dashboard.module.scss';

const StudentDashboard = () => {
  // Mock data - would be fetched from API in real application
  const studentData = {
    name: "John Smith",
    rollNo: "Fall 23-BSSE-123",
    department: "Software Engineering",
    gpa: 3.75,
    attendance: 92,
    semester: "Fall 2023",
    courses: [
      { id: 1, code: "CSE101", name: "Introduction to Programming", progress: 85, grade: "A", credits: 3 },
      { id: 2, code: "CSE201", name: "Data Structures and Algorithms", progress: 72, grade: "B+", credits: 4 },
      { id: 3, code: "MAT202", name: "Discrete Mathematics", progress: 91, grade: "A", credits: 3 },
      { id: 4, code: "ENG101", name: "Technical Communication", progress: 78, grade: "B", credits: 2 }
    ],
    upcomingAssignments: [
      { id: 1, title: "Programming Assignment 3", course: "CSE101", dueDate: "2023-05-15" },
      { id: 2, title: "Data Structures Project", course: "CSE201", dueDate: "2023-05-20" },
      { id: 3, title: "Mathematics Problem Set", course: "MAT202", dueDate: "2023-05-18" }
    ],
    announcements: [
      { id: 1, title: "Mid-term Exam Schedule", date: "2023-05-10", content: "Mid-term exams will begin on June 15th. Schedule has been posted on the bulletin board." },
      { id: 2, title: "Campus Career Fair", date: "2023-05-07", content: "Annual career fair will be held on May 25th. All students are encouraged to attend." }
    ]
  };

  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <div className={styles.welcomeSection}>
          <h1>Welcome, {studentData.name}</h1>
          <p className={styles.subtitle}>Student Dashboard • {studentData.department}</p>
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
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Award size={24} /></div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{studentData.gpa}</h3>
            <p className={styles.statLabel}>Current GPA</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><BookOpen size={24} /></div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{studentData.courses.length}</h3>
            <p className={styles.statLabel}>Courses Enrolled</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Clock size={24} /></div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{studentData.attendance}%</h3>
            <p className={styles.statLabel}>Attendance Rate</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><FileText size={24} /></div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{studentData.upcomingAssignments.length}</h3>
            <p className={styles.statLabel}>Pending Assignments</p>
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'courses' ? styles.active : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            My Courses
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'assignments' ? styles.active : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            Assignments
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div className={styles.overviewContainer}>
              <div className={styles.columnLeft}>
                <div className={styles.widgetCard}>
                  <div className={styles.widgetHeader}>
                    <h2 className={styles.widgetTitle}>Course Progress</h2>
                  </div>
                  <div className={styles.courseProgressList}>
                    {studentData.courses.slice(0, 3).map(course => (
                      <div key={course.id} className={styles.courseProgressItem}>
                        <div className={styles.courseInfo}>
                          <h4 className={styles.courseCode}>{course.code}</h4>
                          <p className={styles.courseName}>{course.name}</p>
                        </div>
                        <div className={styles.progressWrapper}>
                          <div className={styles.progressBar}>
                            <div 
                              className={styles.progressFill} 
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <span className={styles.progressText}>{course.progress}%</span>
                        </div>
                      </div>
                    ))}
                    <button className={styles.viewAllButton}>View All Courses</button>
                  </div>
                </div>
              </div>

              <div className={styles.columnRight}>
                <div className={styles.widgetCard}>
                  <div className={styles.widgetHeader}>
                    <h2 className={styles.widgetTitle}>Upcoming Assignments</h2>
                  </div>
                  <div className={styles.assignmentsList}>
                    {studentData.upcomingAssignments.map(assignment => (
                      <div key={assignment.id} className={styles.assignmentItem}>
                        <div className={styles.assignmentInfo}>
                          <h4 className={styles.assignmentTitle}>{assignment.title}</h4>
                          <p className={styles.assignmentCourse}>{assignment.course}</p>
                        </div>
                        <div className={styles.assignmentDueDate}>
                          <span className={styles.dueLabel}>Due:</span>
                          <span className={styles.dueValue}>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.widgetCard}>
                  <div className={styles.widgetHeader}>
                    <h2 className={styles.widgetTitle}>Announcements</h2>
                  </div>
                  <div className={styles.announcementsList}>
                    {studentData.announcements.map(announcement => (
                      <div key={announcement.id} className={styles.announcementItem}>
                        <div className={styles.announcementHeader}>
                          <h4 className={styles.announcementTitle}>{announcement.title}</h4>
                          <span className={styles.announcementDate}>{new Date(announcement.date).toLocaleDateString()}</span>
                        </div>
                        <p className={styles.announcementContent}>{announcement.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className={styles.coursesContainer}>
              <div className={styles.coursesGrid}>
                {studentData.courses.map(course => (
                  <div key={course.id} className={styles.courseCard}>
                    <div className={styles.courseCardHeader}>
                      <h3 className={styles.courseCodeTitle}>{course.code}</h3>
                      <span className={styles.courseCredits}>{course.credits} Credits</span>
                    </div>
                    <h4 className={styles.courseCardTitle}>{course.name}</h4>
                    <div className={styles.courseCardProgress}>
                      <div className={styles.progressCircle}>
                        <svg width="80" height="80" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="34" fill="none" stroke="#e6e6e6" strokeWidth="6" />
                          <circle 
                            cx="40" 
                            cy="40" 
                            r="34" 
                            fill="none" 
                            stroke="var(--primary-color)" 
                            strokeWidth="6" 
                            strokeDasharray="213.52" 
                            strokeDashoffset={213.52 - (213.52 * course.progress) / 100} 
                            strokeLinecap="round" 
                          />
                        </svg>
                        <div className={styles.progressText}>{course.progress}%</div>
                      </div>
                    </div>
                    <div className={styles.courseCardFooter}>
                      <span className={styles.courseGrade}>Grade: {course.grade}</span>
                      <button className={styles.courseDetailsButton}>View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className={styles.assignmentsContainer}>
              <div className={styles.assignmentsTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableHeaderCell}>Assignment</div>
                  <div className={styles.tableHeaderCell}>Course</div>
                  <div className={styles.tableHeaderCell}>Due Date</div>
                  <div className={styles.tableHeaderCell}>Status</div>
                  <div className={styles.tableHeaderCell}>Action</div>
                </div>
                {studentData.upcomingAssignments.map((assignment, index) => (
                  <div key={assignment.id} className={styles.tableRow}>
                    <div className={styles.tableCell}>{assignment.title}</div>
                    <div className={styles.tableCell}>{assignment.course}</div>
                    <div className={styles.tableCell}>{new Date(assignment.dueDate).toLocaleDateString()}</div>
                    <div className={styles.tableCell}>
                      <span className={styles.statusPending}>Pending</span>
                    </div>
                    <div className={styles.tableCell}>
                      <button className={styles.actionButton}>Submit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 