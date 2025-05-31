import React, { useState, useEffect } from 'react';
import styles from '../styles/pages/teacherMarks.module.scss';
import styless from '../styles/pages/teacherAttendance.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherCourses } from '../features/teacherDashboard/teacherDashboardSlice';
import CustomTable from '../components/common/CustomTable';
import { addMarks } from '../features/teacherDashboard/addMarksSlice';
import { getMarks } from '../features/teacherDashboard/getMarksSlice';

const TeacherMarks = () => {
  const dispatch = useDispatch();
  const { courses, isLoading, error } = useSelector(state => state.teacherDashboard);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const { marks } = useSelector(state => state.getMarks|| []);

  useEffect(() => {
    dispatch(fetchTeacherCourses());
  }, [dispatch]);

  const handleSubjectClick = (course) => {
    setSelectedSubject(course);
    if (selectedType) {
      dispatch(getMarks({ courseId: course._id, type: selectedType }));
    }
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    if (selectedSubject) {
      dispatch(getMarks({ courseId: selectedSubject._id, type }));
    }
  };

  const handleSaveMarks = (updatedMarks) => {
    const marksData = {
      courseId: selectedSubject._id,
      type: selectedType,
      marks: updatedMarks
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

      {selectedSubject && selectedType && (
        <div className={styles.marksTable}>
          <h3>{`${selectedSubject.courseName} - ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Marks`}</h3>
          <CustomTable
            headers={["Roll No", "Student Name", "Marks", "Total Marks", "Actions"]}
            data={marks.map(mark => ({
              "Roll No": mark.student.rollNo,
              "Student Name": mark.student.name,
              "Marks": mark.marks,
              "Total Marks": getMaxMarks(selectedType),
              "Actions": "Edit"
            }))}
            onSave={handleSaveMarks}
          />
        </div>
      )}
    </div>
  );
};

export default TeacherMarks; 