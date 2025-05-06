import React, { useState } from 'react';
import { Bookmark, Calendar, CheckCircle, Clock, Download, ExternalLink, FileText, Filter, Search, Upload, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import styles from '../styles/pages/dashboard.module.scss';
import assignmentStyles from '../styles/pages/assignments.module.scss';

const StudentAssignments = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [visibleDetails, setVisibleDetails] = useState(null);

  // Mock data for assignments - would be fetched from API
  const studentData = {
    name: "John Smith",
    rollNo: "Fall 23-BSSE-123",
    department: "Software Engineering",
    semester: "Fall 2023"
  };

  const assignments = [
    {
      id: 1,
      courseCode: 'CS301',
      courseName: 'Database Systems',
      title: 'Assignment 1: ER Diagrams',
      description: 'Design an ER diagram for a university database system that includes students, courses, instructors, and departments. Include appropriate relationships and constraints.',
      dueDate: '2023-11-20T23:59:59',
      posted: '2023-11-10T10:30:00',
      status: 'pending',
      totalMarks: 20,
      weightage: 10,
      attachments: [
        { id: 1, name: 'Assignment1_Instructions.pdf', size: '256 KB', type: 'pdf' }
      ]
    },
    {
      id: 2,
      courseCode: 'CS302',
      courseName: 'Operating Systems',
      title: 'Assignment 2: Process Scheduling',
      description: 'Implement a process scheduling simulator for FCFS, SJF, Priority, and Round Robin algorithms. Compare the performance of these algorithms using average waiting time and turnaround time metrics.',
      dueDate: '2023-11-18T23:59:59',
      posted: '2023-11-05T14:15:00',
      status: 'submitted',
      submittedOn: '2023-11-15T16:45:00',
      totalMarks: 25,
      obtainedMarks: 22,
      feedback: 'Well done! Good implementation of scheduling algorithms. The comparative analysis could have been more detailed.',
      weightage: 15,
      attachments: [
        { id: 2, name: 'ProcessScheduling_Instructions.pdf', size: '320 KB', type: 'pdf' },
        { id: 3, name: 'TestCases.txt', size: '12 KB', type: 'txt' }
      ],
      submission: { id: 1, name: 'A2_Solution.zip', size: '1.2 MB', type: 'zip' }
    },
    {
      id: 3,
      courseCode: 'CS303',
      courseName: 'Software Engineering',
      title: 'Assignment 3: Requirements Engineering',
      description: 'Develop a Software Requirements Specification (SRS) document for a library management system. Include functional and non-functional requirements, use cases, and user stories.',
      dueDate: '2023-11-25T23:59:59',
      posted: '2023-11-12T09:00:00',
      status: 'overdue',
      totalMarks: 30,
      weightage: 15,
      attachments: [
        { id: 4, name: 'SRS_Template.docx', size: '150 KB', type: 'docx' },
        { id: 5, name: 'Requirements_Guidelines.pdf', size: '280 KB', type: 'pdf' }
      ]
    },
    {
      id: 4,
      courseCode: 'CS304',
      courseName: 'Computer Networks',
      title: 'Assignment 1: Network Protocols',
      description: 'Analyze and compare TCP and UDP protocols in terms of reliability, speed, and use cases. Implement a simple client-server application using both protocols.',
      dueDate: '2023-11-15T23:59:59',
      posted: '2023-11-01T11:20:00',
      status: 'graded',
      submittedOn: '2023-11-13T20:10:00',
      totalMarks: 20,
      obtainedMarks: 18,
      feedback: 'Excellent comparison of protocols. The implementation works well but lacks proper error handling.',
      weightage: 10,
      attachments: [
        { id: 6, name: 'NetworkProtocols_Assignment.pdf', size: '310 KB', type: 'pdf' }
      ],
      submission: { id: 2, name: 'Network_Assignment.zip', size: '950 KB', type: 'zip' }
    },
    {
      id: 5,
      courseCode: 'CS301',
      courseName: 'Database Systems',
      title: 'Assignment 2: SQL Queries',
      description: 'Write SQL queries for various database operations including joins, aggregations, nested queries, and views. Use the provided sample database for testing.',
      dueDate: '2023-12-05T23:59:59',
      posted: '2023-11-20T13:45:00',
      status: 'pending',
      totalMarks: 15,
      weightage: 7.5,
      attachments: [
        { id: 7, name: 'SQL_Assignment.pdf', size: '220 KB', type: 'pdf' },
        { id: 8, name: 'SampleDB.sql', size: '45 KB', type: 'sql' }
      ]
    }
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setFilterOpen(false);
  };

  const toggleDetails = (id) => {
    if (visibleDetails === id) {
      setVisibleDetails(null);
    } else {
      setVisibleDetails(id);
    }
  };

  // Filter assignments based on selected filter and search term
  const filteredAssignments = assignments.filter(assignment => {
    const statusMatch = selectedFilter === 'all' || assignment.status === selectedFilter;
    const searchMatch = searchTerm === '' || 
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  // Sort assignments by due date (closest first)
  filteredAssignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to format date with time
  const formatDateTime = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  // Helper function to calculate remaining time
  const getRemainingTime = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due - now;
    
    if (diffMs < 0) return 'Overdue';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    } else {
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      if (diffHours > 0) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ${diffMinutes} min${diffMinutes !== 1 ? 's' : ''}`;
      } else {
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
      }
    }
  };

  // Helper function to get status class
  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return assignmentStyles.statusPending;
      case 'submitted': return assignmentStyles.statusSubmitted;
      case 'graded': return assignmentStyles.statusGraded;
      case 'overdue': return assignmentStyles.statusOverdue;
      default: return '';
    }
  };

  // Helper function to get status text
  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'submitted': return 'Submitted';
      case 'graded': return 'Graded';
      case 'overdue': return 'Overdue';
      default: return status;
    }
  };

  // Helper function to get file icon based on type
  const getFileIcon = (fileType) => {
    switch(fileType) {
      case 'pdf': return <FileText size={16} />;
      case 'docx': return <FileText size={16} />;
      case 'txt': return <FileText size={16} />;
      case 'zip': return <FileText size={16} />;
      case 'sql': return <FileText size={16} />;
      default: return <FileText size={16} />;
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
                <h1>Assignments</h1>
                <p className={styles.subtitle}>View and manage your course assignments</p>
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

            <div className={assignmentStyles.assignmentsContainer}>
              <div className={assignmentStyles.assignmentsHeader}>
                <div className={assignmentStyles.searchBox}>
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search assignments..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={assignmentStyles.searchInput}
                  />
                </div>
                
                <div className={assignmentStyles.filterDropdown}>
                  <button 
                    className={assignmentStyles.filterToggle}
                    onClick={toggleFilter}
                  >
                    <Filter size={16} />
                    <span>
                      {selectedFilter === 'all' ? 'All Assignments' : `${getStatusText(selectedFilter)}`}
                    </span>
                    {filterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  
                  {filterOpen && (
                    <div className={assignmentStyles.filterMenu}>
                      <div 
                        className={`${assignmentStyles.filterItem} ${selectedFilter === 'all' ? assignmentStyles.active : ''}`}
                        onClick={() => handleFilterSelect('all')}
                      >
                        All Assignments
                      </div>
                      <div 
                        className={`${assignmentStyles.filterItem} ${selectedFilter === 'pending' ? assignmentStyles.active : ''}`}
                        onClick={() => handleFilterSelect('pending')}
                      >
                        Pending
                      </div>
                      <div 
                        className={`${assignmentStyles.filterItem} ${selectedFilter === 'submitted' ? assignmentStyles.active : ''}`}
                        onClick={() => handleFilterSelect('submitted')}
                      >
                        Submitted
                      </div>
                      <div 
                        className={`${assignmentStyles.filterItem} ${selectedFilter === 'graded' ? assignmentStyles.active : ''}`}
                        onClick={() => handleFilterSelect('graded')}
                      >
                        Graded
                      </div>
                      <div 
                        className={`${assignmentStyles.filterItem} ${selectedFilter === 'overdue' ? assignmentStyles.active : ''}`}
                        onClick={() => handleFilterSelect('overdue')}
                      >
                        Overdue
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={assignmentStyles.assignmentsList}>
                {filteredAssignments.length === 0 ? (
                  <div className={assignmentStyles.noAssignments}>
                    <FileText size={48} strokeWidth={1} />
                    <h3>No assignments found</h3>
                    <p>Try adjusting your filters or search term</p>
                  </div>
                ) : (
                  filteredAssignments.map(assignment => (
                    <div 
                      key={assignment.id} 
                      className={`${assignmentStyles.assignmentCard} ${getStatusClass(assignment.status)}`}
                    >
                      <div 
                        className={assignmentStyles.assignmentHeader}
                        onClick={() => toggleDetails(assignment.id)}
                      >
                        <div className={assignmentStyles.courseInfo}>
                          <span className={assignmentStyles.courseCode}>{assignment.courseCode}</span>
                          <span className={assignmentStyles.courseName}>{assignment.courseName}</span>
                        </div>
                        
                        <div className={assignmentStyles.assignmentTitle}>
                          <h3>{assignment.title}</h3>
                        </div>
                        
                        <div className={assignmentStyles.assignmentMeta}>
                          <div className={assignmentStyles.dueDateContainer}>
                            <Calendar size={16} />
                            <span className={assignmentStyles.dueDate}>Due: {formatDate(assignment.dueDate)}</span>
                          </div>
                          
                          <div className={assignmentStyles.timeLeft}>
                            <Clock size={16} />
                            <span>{getRemainingTime(assignment.dueDate)}</span>
                          </div>
                          
                          <div className={`${assignmentStyles.status} ${getStatusClass(assignment.status)}`}>
                            {getStatusText(assignment.status)}
                          </div>
                        </div>
                        
                        <button 
                          className={assignmentStyles.toggleButton}
                        >
                          {visibleDetails === assignment.id ? 
                            <ChevronUp size={20} /> : 
                            <ChevronDown size={20} />
                          }
                        </button>
                      </div>
                      
                      {visibleDetails === assignment.id && (
                        <div className={assignmentStyles.assignmentDetails}>
                          <div className={assignmentStyles.assignmentDescription}>
                            <h4>Description</h4>
                            <p>{assignment.description}</p>
                          </div>
                          
                          <div className={assignmentStyles.assignmentInfo}>
                            <div className={assignmentStyles.infoColumns}>
                              <div className={assignmentStyles.infoColumn}>
                                <div className={assignmentStyles.infoItem}>
                                  <span className={assignmentStyles.infoLabel}>Posted On</span>
                                  <span className={assignmentStyles.infoValue}>{formatDateTime(assignment.posted)}</span>
                                </div>
                                <div className={assignmentStyles.infoItem}>
                                  <span className={assignmentStyles.infoLabel}>Due Date</span>
                                  <span className={assignmentStyles.infoValue}>{formatDateTime(assignment.dueDate)}</span>
                                </div>
                                {assignment.submittedOn && (
                                  <div className={assignmentStyles.infoItem}>
                                    <span className={assignmentStyles.infoLabel}>Submitted On</span>
                                    <span className={assignmentStyles.infoValue}>{formatDateTime(assignment.submittedOn)}</span>
                                  </div>
                                )}
                              </div>
                              <div className={assignmentStyles.infoColumn}>
                                <div className={assignmentStyles.infoItem}>
                                  <span className={assignmentStyles.infoLabel}>Total Marks</span>
                                  <span className={assignmentStyles.infoValue}>{assignment.totalMarks}</span>
                                </div>
                                <div className={assignmentStyles.infoItem}>
                                  <span className={assignmentStyles.infoLabel}>Weightage</span>
                                  <span className={assignmentStyles.infoValue}>{assignment.weightage}%</span>
                                </div>
                                {assignment.obtainedMarks !== undefined && (
                                  <div className={assignmentStyles.infoItem}>
                                    <span className={assignmentStyles.infoLabel}>Obtained Marks</span>
                                    <span className={`${assignmentStyles.infoValue} ${assignmentStyles.marks}`}>
                                      {assignment.obtainedMarks}/{assignment.totalMarks}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className={assignmentStyles.horizontalDivider}></div>
                          
                          <div className={assignmentStyles.assignmentAttachments}>
                            <h4>Attachments</h4>
                            <div className={assignmentStyles.attachmentsList}>
                              {assignment.attachments.map(attachment => (
                                <div key={attachment.id} className={assignmentStyles.attachmentItem}>
                                  {getFileIcon(attachment.type)}
                                  <span className={assignmentStyles.attachmentName}>{attachment.name}</span>
                                  <span className={assignmentStyles.attachmentSize}>{attachment.size}</span>
                                  <a href="#" className={assignmentStyles.downloadLink}>
                                    <Download size={16} />
                                    <span>Download</span>
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {assignment.feedback && (
                            <div className={assignmentStyles.feedbackSection}>
                              <h4>Feedback</h4>
                              <div className={assignmentStyles.feedback}>
                                <div className={assignmentStyles.feedbackIcon}>
                                  <CheckCircle size={20} />
                                </div>
                                <p>{assignment.feedback}</p>
                              </div>
                            </div>
                          )}
                          
                          {assignment.submission && (
                            <div className={assignmentStyles.submissionSection}>
                              <h4>Your Submission</h4>
                              <div className={assignmentStyles.submissionFile}>
                                {getFileIcon(assignment.submission.type)}
                                <span className={assignmentStyles.fileName}>{assignment.submission.name}</span>
                                <span className={assignmentStyles.fileSize}>{assignment.submission.size}</span>
                                <a href="#" className={assignmentStyles.downloadLink}>
                                  <Download size={16} />
                                  <span>Download</span>
                                </a>
                              </div>
                            </div>
                          )}
                          
                          {assignment.status === 'pending' || assignment.status === 'overdue' ? (
                            <div className={assignmentStyles.submitSection}>
                              <button className={assignmentStyles.submitButton}>
                                <Upload size={16} />
                                <span>Submit Assignment</span>
                              </button>
                              {assignment.status === 'overdue' && (
                                <div className={assignmentStyles.overdueWarning}>
                                  <AlertCircle size={16} />
                                  <span>This assignment is overdue. Late submissions may be penalized.</span>
                                </div>
                              )}
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAssignments; 