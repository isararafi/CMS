import React, { useState, useEffect } from 'react';
import { Bookmark, Calendar, CheckCircle, Clock, Download, ExternalLink, FileText, Filter, Search, Upload, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import styles from '../styles/pages/studentAssignments.module.scss';
import assignmentStyles from '../styles/pages/assignments.module.scss';
import { fetchStudentAssignments } from '../features/student/studentAssignmentsSlice';
import { fetchStudentProfile } from '../features/student/studentProfileSlice';
import { useToast } from '../context/ToastContext';

const StudentAssignments = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [visibleDetails, setVisibleDetails] = useState(null);

  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { assignments, loading, error } = useSelector(state => state.studentAssignments);
  const { profile } = useSelector(state => state.studentProfile);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchStudentAssignments()).unwrap();
        await dispatch(fetchStudentProfile()).unwrap();
        showToast('Assignments loaded successfully', 'success');
      } catch (error) {
        showToast(error.message || 'Failed to load assignments', 'error');
      }
    };
    
    fetchData();
  }, [dispatch]);

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

  const handleSubmitAssignment = async (assignmentId) => {
    try {
      // Add your submission logic here
      showToast('Assignment submitted successfully', 'success');
    } catch (error) {
      showToast('Failed to submit assignment', 'error');
    }
  };

  const handleDownloadAssignment = async (assignmentId) => {
    try {
      // Add your download logic here
      showToast('Assignment downloaded successfully', 'success');
    } catch (error) {
      showToast('Failed to download assignment', 'error');
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
      {/* Decorative elements */}
      <div className={styles.decorativeWave}></div>
      <div className={styles.decorativeTriangle}></div>
      <div className={styles.decorativeCircle}></div>
      <div className={styles.decorativeDots}></div>
      <div className={styles.decorativeDiamond}></div>
      
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        {/* <Navbar toggleSidebar={toggleSidebar} /> */}
        
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
                  <span className={styles.value}>{profile?.rollNo || 'N/A'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Semester:</span>
                  <span className={styles.value}>{profile?.semester || 'N/A'}</span>
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
                                  <a href={attachment.url} className={assignmentStyles.downloadLink} download>
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