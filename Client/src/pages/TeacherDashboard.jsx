import React, { useState } from 'react';
import { Users, BookOpen, ClipboardList, Calendar, BarChart2, CheckCircle } from 'lucide-react';
import styles from '../styles/pages/dashboard.module.scss';

const TeacherDashboard = () => {
  // Mock data - would be fetched from API in real application
  const teacherData = {
    name: "Dr. Emily Johnson",
    department: "Computer Science",
    email: "emily.johnson@university.edu",
    position: "Associate Professor",
    classes: [
      { id: 1, code: "CSE101", name: "Introduction to Programming", students: 35, schedule: "Mon/Wed 10:00-11:30 AM", room: "CS-301" },
      { id: 2, code: "CSE201", name: "Data Structures and Algorithms", students: 28, schedule: "Tue/Thu 1:00-2:30 PM", room: "CS-205" },
      { id: 3, code: "CSE405", name: "Advanced Software Engineering", students: 22, schedule: "Fri 9:00-12:00 PM", room: "CS-101" }
    ],
    upcomingClasses: [
      { id: 1, code: "CSE101", name: "Introduction to Programming", time: "10:00 AM", room: "CS-301", remaining: "2 hours" },
      { id: 2, code: "CSE201", name: "Data Structures and Algorithms", time: "1:00 PM", room: "CS-205", remaining: "5 hours" }
    ],
    pendingTasks: [
      { id: 1, title: "Grade CSE101 Assignment 3", course: "CSE101", dueDate: "2023-05-15", status: "Pending" },
      { id: 2, title: "Update CSE201 Course Materials", course: "CSE201", dueDate: "2023-05-12", status: "In Progress" },
      { id: 3, title: "Submit Research Progress Report", course: null, dueDate: "2023-05-20", status: "Not Started" }
    ],
    studentPerformance: [
      { course: "CSE101", excellent: 10, good: 15, average: 7, poor: 3 },
      { course: "CSE201", excellent: 8, good: 12, average: 5, poor: 3 },
      { course: "CSE405", excellent: 12, good: 6, average: 3, poor: 1 }
    ],
    announcements: [
      { id: 1, title: "Faculty Meeting Reminder", date: "2023-05-10", content: "Reminder: Faculty meeting tomorrow at 3 PM in the conference room." },
      { id: 2, title: "Research Funding Opportunity", date: "2023-05-07", content: "New research grants available. Applications due by June 1st." }
    ]
  };

  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <div className={styles.welcomeSection}>
          <h1>Welcome, {teacherData.name}</h1>
          <p className={styles.subtitle}>Faculty Dashboard • {teacherData.department}</p>
        </div>
        <div className={styles.teacherInfo}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Position:</span>
            <span className={styles.value}>{teacherData.position}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{teacherData.email}</span>
          </div>
        </div>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><BookOpen size={24} /></div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{teacherData.classes.length}</h3>
            <p className={styles.statLabel}>Classes Teaching</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Users size={24} /></div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{teacherData.classes.reduce((sum, c) => sum + c.students, 0)}</h3>
            <p className={styles.statLabel}>Total Students</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><ClipboardList size={24} /></div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{teacherData.pendingTasks.length}</h3>
            <p className={styles.statLabel}>Pending Tasks</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Calendar size={24} /></div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{teacherData.upcomingClasses.length}</h3>
            <p className={styles.statLabel}>Today's Classes</p>
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
            className={`${styles.tabButton} ${activeTab === 'classes' ? styles.active : ''}`}
            onClick={() => setActiveTab('classes')}
          >
            My Classes
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'assessments' ? styles.active : ''}`}
            onClick={() => setActiveTab('assessments')}
          >
            Assessments
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div className={styles.overviewContainer}>
              <div className={styles.columnLeft}>
                <div className={styles.widgetCard}>
                  <div className={styles.widgetHeader}>
                    <h2 className={styles.widgetTitle}>Today's Schedule</h2>
                  </div>
                  <div className={styles.classScheduleList}>
                    {teacherData.upcomingClasses.map(classItem => (
                      <div key={classItem.id} className={styles.scheduleItem}>
                        <div className={styles.scheduleTimeBlock}>
                          <div className={styles.scheduleTime}>{classItem.time}</div>
                          <div className={styles.scheduleRemaining}>{classItem.remaining}</div>
                        </div>
                        <div className={styles.scheduleDetails}>
                          <h4 className={styles.scheduleTitle}>{classItem.code}: {classItem.name}</h4>
                          <p className={styles.scheduleLocation}>Room: {classItem.room}</p>
                        </div>
                      </div>
                    ))}
                    {teacherData.upcomingClasses.length === 0 && (
                      <div className={styles.emptySchedule}>
                        <p>No classes scheduled for today.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.widgetCard}>
                  <div className={styles.widgetHeader}>
                    <h2 className={styles.widgetTitle}>Tasks & To-Do</h2>
                  </div>
                  <div className={styles.tasksList}>
                    {teacherData.pendingTasks.map(task => (
                      <div key={task.id} className={styles.taskItem}>
                        <div className={styles.taskCheckbox}>
                          <input type="checkbox" id={`task-${task.id}`} className={styles.checkbox} />
                          <label htmlFor={`task-${task.id}`} className={styles.checkboxLabel}></label>
                        </div>
                        <div className={styles.taskDetails}>
                          <h4 className={styles.taskTitle}>{task.title}</h4>
                          {task.course && <p className={styles.taskCourse}>{task.course}</p>}
                        </div>
                        <div className={styles.taskMeta}>
                          <span className={styles.taskDueDate}>{new Date(task.dueDate).toLocaleDateString()}</span>
                          <span className={`${styles.taskStatus} ${styles[`status${task.status.replace(/\s+/g, '')}`]}`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.columnRight}>
                <div className={styles.widgetCard}>
                  <div className={styles.widgetHeader}>
                    <h2 className={styles.widgetTitle}>Student Performance</h2>
                  </div>
                  <div className={styles.performanceChart}>
                    {teacherData.studentPerformance.map((course, index) => (
                      <div key={index} className={styles.performanceItem}>
                        <h4 className={styles.performanceCourse}>{course.course}</h4>
                        <div className={styles.performanceBar}>
                          <div 
                            className={`${styles.performanceSegment} ${styles.excellent}`}
                            style={{ width: `${(course.excellent / (course.excellent + course.good + course.average + course.poor)) * 100}%` }}
                            title={`Excellent: ${course.excellent} students`}
                          ></div>
                          <div 
                            className={`${styles.performanceSegment} ${styles.good}`}
                            style={{ width: `${(course.good / (course.excellent + course.good + course.average + course.poor)) * 100}%` }}
                            title={`Good: ${course.good} students`}
                          ></div>
                          <div 
                            className={`${styles.performanceSegment} ${styles.average}`}
                            style={{ width: `${(course.average / (course.excellent + course.good + course.average + course.poor)) * 100}%` }}
                            title={`Average: ${course.average} students`}
                          ></div>
                          <div 
                            className={`${styles.performanceSegment} ${styles.poor}`}
                            style={{ width: `${(course.poor / (course.excellent + course.good + course.average + course.poor)) * 100}%` }}
                            title={`Poor: ${course.poor} students`}
                          ></div>
                        </div>
                        <div className={styles.performanceLegend}>
                          <span className={styles.legendItem}>
                            <span className={`${styles.legendColor} ${styles.excellentColor}`}></span>
                            Excellent ({course.excellent})
                          </span>
                          <span className={styles.legendItem}>
                            <span className={`${styles.legendColor} ${styles.goodColor}`}></span>
                            Good ({course.good})
                          </span>
                          <span className={styles.legendItem}>
                            <span className={`${styles.legendColor} ${styles.averageColor}`}></span>
                            Average ({course.average})
                          </span>
                          <span className={styles.legendItem}>
                            <span className={`${styles.legendColor} ${styles.poorColor}`}></span>
                            Needs Help ({course.poor})
                          </span>
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
                    {teacherData.announcements.map(announcement => (
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

          {activeTab === 'classes' && (
            <div className={styles.classesContainer}>
              <div className={styles.classesGrid}>
                {teacherData.classes.map(classItem => (
                  <div key={classItem.id} className={styles.classCard}>
                    <div className={styles.classCardHeader}>
                      <h3 className={styles.classCode}>{classItem.code}</h3>
                      <span className={styles.classStudents}>
                        <Users size={16} /> {classItem.students} students
                      </span>
                    </div>
                    <h4 className={styles.className}>{classItem.name}</h4>
                    <div className={styles.classDetails}>
                      <div className={styles.classSchedule}>
                        <Calendar size={16} />
                        <span>{classItem.schedule}</span>
                      </div>
                      <div className={styles.classRoom}>
                        <span>Room {classItem.room}</span>
                      </div>
                    </div>
                    <div className={styles.classCardActions}>
                      <button className={styles.classActionButton}>Take Attendance</button>
                      <button className={styles.classActionButton}>Manage Class</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'assessments' && (
            <div className={styles.assessmentsContainer}>
              <div className={styles.assessmentTabs}>
                <button className={`${styles.assessmentTabButton} ${styles.active}`}>
                  Assignments
                </button>
                <button className={styles.assessmentTabButton}>
                  Quizzes
                </button>
                <button className={styles.assessmentTabButton}>
                  Exams
                </button>
              </div>
              
              <div className={styles.assessmentContent}>
                <div className={styles.assessmentActions}>
                  <button className={styles.createButton}>
                    Create New Assignment
                  </button>
                  <div className={styles.filterGroup}>
                    <select className={styles.filterSelect}>
                      <option>All Courses</option>
                      {teacherData.classes.map(classItem => (
                        <option key={classItem.id} value={classItem.code}>{classItem.code}</option>
                      ))}
                    </select>
                    <select className={styles.filterSelect}>
                      <option>All Status</option>
                      <option>Published</option>
                      <option>Draft</option>
                      <option>Archived</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.assessmentsTable}>
                  <div className={styles.tableHeader}>
                    <div className={styles.tableHeaderCell}>Assignment</div>
                    <div className={styles.tableHeaderCell}>Course</div>
                    <div className={styles.tableHeaderCell}>Due Date</div>
                    <div className={styles.tableHeaderCell}>Submissions</div>
                    <div className={styles.tableHeaderCell}>Status</div>
                    <div className={styles.tableHeaderCell}>Actions</div>
                  </div>
                  
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>Programming Assignment 3</div>
                    <div className={styles.tableCell}>CSE101</div>
                    <div className={styles.tableCell}>May 15, 2023</div>
                    <div className={styles.tableCell}>18/35</div>
                    <div className={styles.tableCell}>
                      <span className={styles.statusPublished}>Published</span>
                    </div>
                    <div className={styles.tableCell}>
                      <div className={styles.actionButtons}>
                        <button className={styles.actionButton}>View</button>
                        <button className={styles.actionButton}>Edit</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>Data Structures Project</div>
                    <div className={styles.tableCell}>CSE201</div>
                    <div className={styles.tableCell}>May 20, 2023</div>
                    <div className={styles.tableCell}>5/28</div>
                    <div className={styles.tableCell}>
                      <span className={styles.statusPublished}>Published</span>
                    </div>
                    <div className={styles.tableCell}>
                      <div className={styles.actionButtons}>
                        <button className={styles.actionButton}>View</button>
                        <button className={styles.actionButton}>Edit</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>Final Project</div>
                    <div className={styles.tableCell}>CSE405</div>
                    <div className={styles.tableCell}>June 10, 2023</div>
                    <div className={styles.tableCell}>0/22</div>
                    <div className={styles.tableCell}>
                      <span className={styles.statusDraft}>Draft</span>
                    </div>
                    <div className={styles.tableCell}>
                      <div className={styles.actionButtons}>
                        <button className={styles.actionButton}>View</button>
                        <button className={styles.actionButton}>Edit</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 