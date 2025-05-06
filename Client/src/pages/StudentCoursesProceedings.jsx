import React, { useState } from 'react';
import { Calendar, Filter, Search, FileText, BookOpen, Video, Download, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import styles from '../styles/pages/dashboard.module.scss';

const StudentCoursesProceedings = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedWeek, setSelectedWeek] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProceeding, setExpandedProceeding] = useState(null);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [weekDropdownOpen, setWeekDropdownOpen] = useState(false);

  // Mock data - would be fetched from API
  const studentData = {
    name: "John Smith",
    rollNo: "Fall 23-BSSE-123",
    department: "Software Engineering",
    semester: "Fall 2023"
  };

  const courses = [
    { id: 'cs301', code: 'CS301', name: 'Database Systems' },
    { id: 'cs302', code: 'CS302', name: 'Operating Systems' },
    { id: 'cs303', code: 'CS303', name: 'Software Engineering' },
    { id: 'cs304', code: 'CS304', name: 'Computer Networks' },
  ];

  const weeks = Array.from({ length: 16 }, (_, i) => ({
    id: `week${i + 1}`,
    name: `Week ${i + 1}`
  }));

  const proceedings = [
    {
      id: 1,
      courseId: 'cs301',
      week: 'week1',
      date: '2023-08-15',
      topics: ['Introduction to Database Systems', 'DBMS Architecture'],
      content: 'Database is a collection of related data and data is a collection of facts and figures that can be processed to produce information. Mainly focused on DBMS architecture including its components and functions.',
      materials: [
        { id: 1, type: 'pdf', name: 'Lecture Slides', url: '#' },
        { id: 2, type: 'pdf', name: 'Reading Material', url: '#' },
      ],
      assignments: [
        { id: 1, name: 'Assignment 1: DBMS Concepts', dueDate: '2023-08-22' }
      ],
      recordedLecture: { available: true, duration: '1h 45m', url: '#' }
    },
    {
      id: 2,
      courseId: 'cs301',
      week: 'week2',
      date: '2023-08-22',
      topics: ['Entity-Relationship Model', 'ER Diagrams'],
      content: 'The Entity-Relationship (ER) model is a high-level data model diagram. Covered entity types, relationship types, attributes, keys, and mapping constraints. Practice session on drawing ER diagrams.',
      materials: [
        { id: 3, type: 'pdf', name: 'Lecture Slides', url: '#' },
        { id: 4, type: 'pdf', name: 'Practice Problems', url: '#' },
      ],
      assignments: [
        { id: 2, name: 'Assignment 2: ER Diagrams', dueDate: '2023-08-29' }
      ],
      recordedLecture: { available: true, duration: '1h 30m', url: '#' }
    },
    {
      id: 3,
      courseId: 'cs302',
      week: 'week1',
      date: '2023-08-16',
      topics: ['Introduction to Operating Systems', 'OS Functions'],
      content: 'Overview of operating systems, their functions, types, and evolution. Discussed process management, memory management, file systems, and device management as core functions.',
      materials: [
        { id: 5, type: 'pdf', name: 'Lecture Notes', url: '#' },
        { id: 6, type: 'pdf', name: 'Recommended Readings', url: '#' },
      ],
      assignments: [
        { id: 3, name: 'Assignment 1: OS Concepts', dueDate: '2023-08-23' }
      ],
      recordedLecture: { available: true, duration: '1h 40m', url: '#' }
    },
    {
      id: 4,
      courseId: 'cs302',
      week: 'week2',
      date: '2023-08-23',
      topics: ['Process Management', 'Process States'],
      content: 'Detailed discussion on process concept, process states, PCB, context switching, and process scheduling algorithms. Practical examples on how processes are managed in modern operating systems.',
      materials: [
        { id: 7, type: 'pdf', name: 'Lecture Slides', url: '#' },
        { id: 8, type: 'code', name: 'Code Examples', url: '#' },
      ],
      assignments: [
        { id: 4, name: 'Assignment 2: Process Scheduling', dueDate: '2023-08-30' }
      ],
      recordedLecture: { available: false, duration: null, url: null }
    },
    {
      id: 5,
      courseId: 'cs303',
      week: 'week1',
      date: '2023-08-17',
      topics: ['Introduction to Software Engineering', 'Software Process Models'],
      content: 'Overview of software engineering principles and practices. Covered various software process models including Waterfall, Incremental, and Agile methodologies.',
      materials: [
        { id: 9, type: 'pdf', name: 'Course Outline', url: '#' },
        { id: 10, type: 'pdf', name: 'Lecture Slides', url: '#' },
      ],
      assignments: [
        { id: 5, name: 'Assignment 1: Process Models', dueDate: '2023-08-24' }
      ],
      recordedLecture: { available: true, duration: '1h 35m', url: '#' }
    },
    {
      id: 6,
      courseId: 'cs304',
      week: 'week1',
      date: '2023-08-18',
      topics: ['Introduction to Computer Networks', 'Network Models'],
      content: 'Introduction to computer networks, their types, topologies, and applications. Detailed overview of OSI and TCP/IP reference models.',
      materials: [
        { id: 11, type: 'pdf', name: 'Lecture Slides', url: '#' },
        { id: 12, type: 'pdf', name: 'Network Basics', url: '#' },
      ],
      assignments: [
        { id: 6, name: 'Assignment 1: Network Models', dueDate: '2023-08-25' }
      ],
      recordedLecture: { available: true, duration: '1h 50m', url: '#' }
    },
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleCourseDropdown = () => {
    setCourseDropdownOpen(!courseDropdownOpen);
  };

  const toggleWeekDropdown = () => {
    setWeekDropdownOpen(!weekDropdownOpen);
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId);
    setCourseDropdownOpen(false);
  };

  const handleWeekSelect = (weekId) => {
    setSelectedWeek(weekId);
    setWeekDropdownOpen(false);
  };

  const toggleProceedingExpand = (id) => {
    setExpandedProceeding(expandedProceeding === id ? null : id);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Filter proceedings based on selected course, week, and search term
  const filteredProceedings = proceedings.filter(proceeding => {
    const courseMatch = selectedCourse === 'all' || proceeding.courseId === selectedCourse;
    const weekMatch = selectedWeek === 'all' || proceeding.week === selectedWeek;
    const searchMatch = searchTerm === '' || 
      proceeding.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase())) ||
      proceeding.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    return courseMatch && weekMatch && searchMatch;
  });

  // Get course name by id
  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? `${course.code} - ${course.name}` : '';
  };

  // Get week name by id
  const getWeekName = (weekId) => {
    const week = weeks.find(w => w.id === weekId);
    return week ? week.name : '';
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
                <h1>Class Proceedings</h1>
                <p className={styles.subtitle}>Track class activities, materials, and assignments</p>
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

            <div className={styles.proceedingsContainer}>
              <div className={styles.proceedingsFilters}>
                <div className={styles.searchBox}>
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search topics or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
                
                <div className={styles.filtersGroup}>
                  <div className={styles.filterDropdown}>
                    <button 
                      className={styles.dropdownToggle}
                      onClick={toggleCourseDropdown}
                    >
                      <Filter size={16} />
                      <span>
                        {selectedCourse === 'all' 
                          ? 'All Courses' 
                          : getCourseName(selectedCourse)}
                      </span>
                      {courseDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {courseDropdownOpen && (
                      <div className={styles.dropdownMenu}>
                        <div 
                          className={`${styles.dropdownItem} ${selectedCourse === 'all' ? styles.active : ''}`}
                          onClick={() => handleCourseSelect('all')}
                        >
                          All Courses
                        </div>
                        {courses.map(course => (
                          <div 
                            key={course.id}
                            className={`${styles.dropdownItem} ${selectedCourse === course.id ? styles.active : ''}`}
                            onClick={() => handleCourseSelect(course.id)}
                          >
                            {course.code} - {course.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.filterDropdown}>
                    <button 
                      className={styles.dropdownToggle}
                      onClick={toggleWeekDropdown}
                    >
                      <Calendar size={16} />
                      <span>
                        {selectedWeek === 'all' 
                          ? 'All Weeks' 
                          : getWeekName(selectedWeek)}
                      </span>
                      {weekDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {weekDropdownOpen && (
                      <div className={styles.dropdownMenu}>
                        <div 
                          className={`${styles.dropdownItem} ${selectedWeek === 'all' ? styles.active : ''}`}
                          onClick={() => handleWeekSelect('all')}
                        >
                          All Weeks
                        </div>
                        {weeks.map(week => (
                          <div 
                            key={week.id}
                            className={`${styles.dropdownItem} ${selectedWeek === week.id ? styles.active : ''}`}
                            onClick={() => handleWeekSelect(week.id)}
                          >
                            {week.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={styles.proceedingsList}>
                {filteredProceedings.length === 0 ? (
                  <div className={styles.noProceedings}>
                    <FileText size={48} strokeWidth={1} />
                    <h3>No proceedings found</h3>
                    <p>Try adjusting your filters or search term</p>
                  </div>
                ) : (
                  filteredProceedings.map(proceeding => (
                    <div 
                      key={proceeding.id} 
                      className={`${styles.proceedingCard} ${expandedProceeding === proceeding.id ? styles.expanded : ''}`}
                    >
                      <div 
                        className={styles.proceedingHeader}
                        onClick={() => toggleProceedingExpand(proceeding.id)}
                      >
                        <div className={styles.proceedingMeta}>
                          <div className={styles.proceedingCourse}>
                            {getCourseName(proceeding.courseId)}
                          </div>
                          <div className={styles.proceedingDate}>
                            <Calendar size={16} />
                            <span>{formatDate(proceeding.date)}</span>
                          </div>
                          <div className={styles.proceedingWeek}>
                            {getWeekName(proceeding.week)}
                          </div>
                        </div>
                        <div className={styles.proceedingTopics}>
                          <h3>Topics Covered:</h3>
                          <div className={styles.topicsList}>
                            {proceeding.topics.map((topic, index) => (
                              <div key={index} className={styles.topicTag}>
                                {topic}
                              </div>
                            ))}
                          </div>
                        </div>
                        <button className={styles.expandButton}>
                          {expandedProceeding === proceeding.id ? 
                            <ChevronUp size={20} /> : 
                            <ChevronDown size={20} />
                          }
                        </button>
                      </div>
                      
                      {expandedProceeding === proceeding.id && (
                        <div className={styles.proceedingDetails}>
                          <div className={styles.proceedingContent}>
                            <h4>Lecture Content</h4>
                            <p>{proceeding.content}</p>
                          </div>
                          
                          <div className={styles.proceedingResources}>
                            <div className={styles.materialsList}>
                              <h4>Course Materials</h4>
                              {proceeding.materials.map(material => (
                                <div key={material.id} className={styles.materialItem}>
                                  <FileText size={18} />
                                  <span className={styles.materialName}>{material.name}</span>
                                  <a href={material.url} className={styles.materialAction}>
                                    <Download size={16} />
                                    <span>Download</span>
                                  </a>
                                </div>
                              ))}
                            </div>
                            
                            <div className={styles.assignmentsList}>
                              <h4>Assignments</h4>
                              {proceeding.assignments.map(assignment => (
                                <div key={assignment.id} className={styles.assignmentItem}>
                                  <BookOpen size={18} />
                                  <span className={styles.assignmentName}>{assignment.name}</span>
                                  <span className={styles.assignmentDue}>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                  <a href="#" className={styles.assignmentAction}>
                                    <ExternalLink size={16} />
                                    <span>View</span>
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className={styles.proceedingLecture}>
                            <h4>Recorded Lecture</h4>
                            {proceeding.recordedLecture.available ? (
                              <div className={styles.lectureAvailable}>
                                <Video size={18} />
                                <span>Duration: {proceeding.recordedLecture.duration}</span>
                                <a href={proceeding.recordedLecture.url} className={styles.watchButton}>
                                  <span>Watch Lecture</span>
                                </a>
                              </div>
                            ) : (
                              <div className={styles.lectureUnavailable}>
                                <span>Recording not available for this lecture</span>
                              </div>
                            )}
                          </div>
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

export default StudentCoursesProceedings; 