import React, { useState, useEffect } from 'react';
import styles from '../styles/pages/teacherMarks.module.scss';
import styless from '../styles/pages/teacherAttendance.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherCourses, fetchStudents } from '../features/teacherDashboard/teacherDashboardSlice';
import CustomTable from '../components/common/CustomTable';
import { addMarks } from '../features/teacherDashboard/addMarksSlice';

const TeacherMarks = () => {
  const dispatch = useDispatch();
  const { courses, students, isLoading, error } = useSelector(state => state.teacherDashboard);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [studentsMarks, setStudentsMarks] = useState([]);

  useEffect(() => {
    dispatch(fetchTeacherCourses());
  }, [dispatch]);

  useEffect(() => {
    if (students?.students) {
      setStudentsMarks(
        students.students.map(student => ({
          studentId: student._id,
          rollNo: student.rollNo,
          name: student.name,
          marks: 0
        }))
      );
    }
  }, [students]);

  const handleSubjectClick = (course) => {
    setSelectedSubject(course);
    dispatch(fetchStudents(course._id));
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleMarksChange = (studentId, newMarks) => {
    const maxMarks = getMaxMarks(selectedType);
    // Ensure marks don't exceed maximum and are not negative
    const validMarks = Math.min(Math.max(0, Number(newMarks || 0)), maxMarks);
    
    setStudentsMarks(prevMarks =>
      prevMarks.map(student =>
        student.studentId === studentId
          ? { ...student, marks: validMarks }
          : student
      )
    );
  };

  const handleSaveAllMarks = () => {
    const marksData = {
      courseId: selectedSubject._id,
      type: selectedType,
      marks: studentsMarks.map(student => ({
        studentId: student.studentId,
        marks: student.marks,
        totalMarks: getMaxMarks(selectedType)
      }))
    };
    dispatch(addMarks(marksData));
  };

  const getMaxMarks = (type) => {
    switch (type) {
      case 'midterm':
        return 25;
      case 'sessional':
        return 25;
      case 'final':
        return 50;
      default:
        return 0;
    }
  };

  return (
    <div className={styles.marksPage}>
      <h2>Marks Entry</h2>
      
      {/* Mark Type Selection */}
      <div className={styles.markTypes}>
        <button 
          className={`${styles.typeButton} ${selectedType === 'sessional' ? styles.active : ''}`}
          onClick={() => handleTypeSelect('sessional')}
        >
          Sessional
        </button>
        <button 
          className={`${styles.typeButton} ${selectedType === 'midterm' ? styles.active : ''}`}
          onClick={() => handleTypeSelect('midterm')}
        >
          Midterm
        </button>
        <button 
          className={`${styles.typeButton} ${selectedType === 'final' ? styles.active : ''}`}
          onClick={() => handleTypeSelect('final')}
        >
          Final
        </button>
      </div>

      <div className={styless.classesList}>
        {isLoading ? (
          <p>Loading courses...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          courses.map(course => (
            <div 
              key={course._id} 
              className={`${styless.classCard} ${selectedSubject?._id === course._id ? styles.selected : ''}`}
              onClick={() => handleSubjectClick(course)}
            >
              <div className={styless.classHeader}>
                <span className={styless.classCode}>{course.courseCode}</span>
                <span className={styless.className}>{course.courseName}</span>
                <span className={styless.classStudents}>{course.students?.length || 0} students</span>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedSubject && selectedType && students && (
        <div className={styles.marksTable}>
          <h3>{`${selectedSubject.courseName} - ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Marks`}</h3>
          <CustomTable
            headers={["Roll No", "Student Name", "Marks", "Total Marks"]}
            data={studentsMarks.map(student => ({
              "Roll No": student.rollNo,
              "Student Name": student.name,
              "Marks": (
                <input
                  type="number"
                  min="0"
                  max={getMaxMarks(selectedType)}
                  value={student.marks}
                  onChange={(e) => handleMarksChange(student.studentId, e.target.value)}
                  className={styles.marksInput}
                  placeholder="Enter marks"
                />
              ),
              "Total Marks": getMaxMarks(selectedType)
            }))}
          />
          <button 
            className={styles.saveAllButton}
            onClick={handleSaveAllMarks}
            disabled={!studentsMarks.length}
          >
            Add Marks
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherMarks; 