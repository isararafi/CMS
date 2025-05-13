import React, { useState } from 'react';
import { BarChart2, Download, ChevronDown, Search, FileText } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import styles from '../styles/pages/studentResult.module.scss';

const StudentResult = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState('Fall 2023');
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterDropdownOpen, setSemesterDropdownOpen] = useState(false);

  // Mock data - would be fetched from API
  const studentData = {
    name: "John Smith",
    rollNo: "Fall 23-BSSE-123",
    department: "Software Engineering",
    semesters: [
      'Fall 2021', 'Spring 2022', 'Fall 2022', 'Spring 2023', 'Fall 2023'
    ],
    results: {
      'Fall 2023': {
        courses: [
          { id: 1, code: 'CS301', name: 'Database Systems', credits: 3, marks: 87, grade: 'A', status: 'Passed' },
          { id: 2, code: 'CS302', name: 'Operating Systems', credits: 4, marks: 75, grade: 'B+', status: 'Passed' },
          { id: 3, code: 'CS303', name: 'Software Engineering', credits: 3, marks: 92, grade: 'A+', status: 'Passed' },
          { id: 4, code: 'CS304', name: 'Computer Networks', credits: 3, marks: 82, grade: 'A-', status: 'Passed' },
        ],
        gpa: 3.75,
        totalCredits: 13,
        previousCGPA: 3.65,
        currentCGPA: 3.68
      },
      'Spring 2023': {
        courses: [
          { id: 1, code: 'CS201', name: 'Data Structures', credits: 4, marks: 89, grade: 'A', status: 'Passed' },
          { id: 2, code: 'CS202', name: 'Algorithms', credits: 3, marks: 72, grade: 'B', status: 'Passed' },
          { id: 3, code: 'CS203', name: 'Theory of Automata', credits: 3, marks: 65, grade: 'C+', status: 'Passed' },
          { id: 4, code: 'CS204', name: 'Computer Architecture', credits: 3, marks: 78, grade: 'B+', status: 'Passed' },
        ],
        gpa: 3.42,
        totalCredits: 13,
        previousCGPA: 3.5,
        currentCGPA: 3.65
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSemesterSelect = (semester) => {
    setSelectedSemester(semester);
    setSemesterDropdownOpen(false);
  };

  const toggleSemesterDropdown = () => {
    setSemesterDropdownOpen(!semesterDropdownOpen);
  };

  const currentResult = studentData.results[selectedSemester];
  
  const filteredCourses = currentResult ? currentResult.courses.filter(course => 
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const getGradeColor = (grade) => {
    if (grade.includes('A')) return styles.gradeA;
    if (grade.includes('B')) return styles.gradeB;
    if (grade.includes('C')) return styles.gradeC;
    if (grade.includes('D')) return styles.gradeD;
    return styles.gradeF;
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
                <h1>Academic Results</h1>
                <p className={styles.subtitle}>View your course results and academic performance</p>
              </div>
              <div className={styles.studentInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Roll No:</span>
                  <span className={styles.value}>{studentData.rollNo}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Department:</span>
                  <span className={styles.value}>{studentData.department}</span>
                </div>
              </div>
            </div>

            <div className={styles.resultControls}>
              <div className={styles.semesterSelect}>
                <label>Select Semester:</label>
                <div className={styles.dropdownContainer}>
                  <button 
                    className={styles.dropdownToggle}
                    onClick={toggleSemesterDropdown}
                  >
                    {selectedSemester}
                    <ChevronDown size={16} strokeWidth={1.5} />
                  </button>
                  {semesterDropdownOpen && (
                    <div className={styles.dropdownMenu}>
                      {studentData.semesters.map(semester => (
                        <div 
                          key={semester} 
                          className={`${styles.dropdownItem} ${selectedSemester === semester ? styles.active : ''}`}
                          onClick={() => handleSemesterSelect(semester)}
                        >
                          {semester}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.searchContainer}>
                <div className={styles.searchInput}>
                  <Search size={20} strokeWidth={1.5} />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>

              <button className={styles.downloadButton}>
                <Download size={16} strokeWidth={1.5} />
                Download Result
              </button>
            </div>

            <div className={styles.resultContent}>
              <div className={styles.resultSummary}>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryIcon}>
                    <BarChart2 size={24} strokeWidth={1.5} />
                  </div>
                  <div className={styles.summaryDetails}>
                    <h3>Semester GPA</h3>
                    <div className={styles.gpaValue}>{currentResult?.gpa.toFixed(2)}</div>
                  </div>
                </div>

                <div className={styles.summaryCard}>
                  <div className={styles.summaryIcon}>
                    <FileText size={24} strokeWidth={1.5} />
                  </div>
                  <div className={styles.summaryDetails}>
                    <h3>Total Credits</h3>
                    <div className={styles.creditValue}>{currentResult?.totalCredits}</div>
                  </div>
                </div>

                <div className={styles.summaryCard}>
                  <div className={styles.summaryIcon}>
                    <BarChart2 size={24} strokeWidth={1.5} />
                  </div>
                  <div className={styles.summaryDetails}>
                    <h3>CGPA</h3>
                    <div className={styles.cgpaValue}>
                      {currentResult?.currentCGPA.toFixed(2)}
                      <span className={styles.cgpaChange}>
                        {currentResult?.currentCGPA > currentResult?.previousCGPA ? '▲' : '▼'}
                        {Math.abs(currentResult?.currentCGPA - currentResult?.previousCGPA).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.resultTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.thCode}>Course Code</div>
                  <div className={styles.thName}>Course Name</div>
                  <div className={styles.thCredits}>Credits</div>
                  <div className={styles.thMarks}>Marks</div>
                  <div className={styles.thGrade}>Grade</div>
                  <div className={styles.thStatus}>Status</div>
                </div>

                <div className={styles.tableBody}>
                  {filteredCourses.map(course => (
                    <div key={course.id} className={styles.tableRow}>
                      <div className={styles.tdCode}>{course.code}</div>
                      <div className={styles.tdName}>{course.name}</div>
                      <div className={styles.tdCredits}>{course.credits}</div>
                      <div className={styles.tdMarks}>{course.marks}</div>
                      <div className={`${styles.tdGrade} ${getGradeColor(course.grade)}`}>
                        {course.grade}
                      </div>
                      <div className={`${styles.tdStatus} ${course.status === 'Passed' ? styles.statusPassed : styles.statusFailed}`}>
                        {course.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.resultNote}>
                <h3>Grade Scale</h3>
                <div className={styles.gradeScale}>
                  <div className={styles.gradeItem}>
                    <span className={`${styles.grade} ${styles.gradeA}`}>A+</span>
                    <span className={styles.gradePoints}>4.0</span>
                    <span className={styles.gradeRange}>90-100</span>
                  </div>
                  <div className={styles.gradeItem}>
                    <span className={`${styles.grade} ${styles.gradeA}`}>A</span>
                    <span className={styles.gradePoints}>4.0</span>
                    <span className={styles.gradeRange}>85-89</span>
                  </div>
                  <div className={styles.gradeItem}>
                    <span className={`${styles.grade} ${styles.gradeA}`}>A-</span>
                    <span className={styles.gradePoints}>3.7</span>
                    <span className={styles.gradeRange}>80-84</span>
                  </div>
                  <div className={styles.gradeItem}>
                    <span className={`${styles.grade} ${styles.gradeB}`}>B+</span>
                    <span className={styles.gradePoints}>3.3</span>
                    <span className={styles.gradeRange}>75-79</span>
                  </div>
                  <div className={styles.gradeItem}>
                    <span className={`${styles.grade} ${styles.gradeB}`}>B</span>
                    <span className={styles.gradePoints}>3.0</span>
                    <span className={styles.gradeRange}>70-74</span>
                  </div>
                  <div className={styles.gradeItem}>
                    <span className={`${styles.grade} ${styles.gradeC}`}>C+</span>
                    <span className={styles.gradePoints}>2.7</span>
                    <span className={styles.gradeRange}>65-69</span>
                  </div>
                  <div className={styles.gradeItem}>
                    <span className={`${styles.grade} ${styles.gradeC}`}>C</span>
                    <span className={styles.gradePoints}>2.3</span>
                    <span className={styles.gradeRange}>60-64</span>
                  </div>
                  <div className={styles.gradeItem}>
                    <span className={`${styles.grade} ${styles.gradeD}`}>D</span>
                    <span className={styles.gradePoints}>2.0</span>
                    <span className={styles.gradeRange}>50-59</span>
                  </div>
                  <div className={styles.gradeItem}>
                    <span className={`${styles.grade} ${styles.gradeF}`}>F</span>
                    <span className={styles.gradePoints}>0.0</span>
                    <span className={styles.gradeRange}>Below 50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResult; 