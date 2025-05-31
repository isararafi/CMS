import React, { useState } from 'react';
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
  const [students, setStudents] = useState([
    { id: 1, rollNo: 'STU001', name: 'Alice', midMarks: 0, sessionalMarks: 0, finalMarks: 0 },
    { id: 2, rollNo: 'STU002', name: 'Bob', midMarks: 0, sessionalMarks: 0, finalMarks: 0 },
    { id: 3, rollNo: 'STU003', name: 'Charlie', midMarks: 0, sessionalMarks: 0, finalMarks: 0 }
  ]);

  const { marks } = useSelector(state => state.getMarks);

  const handleSubjectClick = (course) => {
    setSelectedSubject(course);
    dispatch(getMarks(course._id));
  };

  const handleMarksChange = (studentId, field, value) => {
    if ((field === 'midMarks' || field === 'sessionalMarks') && (value < 0 || value > 25)) return;
    if (field === 'finalMarks' && (value < 0 || value > 50)) return;
    setStudents(prev => prev.map(student => student.id === studentId ? { ...student, [field]: value } : student));
  };

  const calculateTotal = (student) => {
    return student.midMarks + student.sessionalMarks + student.finalMarks;
  };

  const handleSaveMarks = () => {
    students.forEach(student => {
      const marksData = {
        studentId: student.id,
        courseId: selectedSubject._id,
        type: 'midterm', // Assuming type is midterm, adjust as needed
        marks: student.midMarks,
        totalMarks: 25 // Assuming total marks for midterm is 25, adjust as needed
      };
      dispatch(addMarks(marksData));
    });
    alert('Marks saved successfully');
  };

  const toggleAddSection = (course) => {
    // Define logic for handling the "+" button
  };

  const toggleDeleteSection = (course) => {
    // Define logic for handling the "-" button
  };

  return (
    <div className={styles.marksPage}>
      <h2>Marks Entry</h2>
      <div className={styless.classesList}>
        {isLoading ? (
          <p>Loading courses...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          courses.map(course => (
            <div key={course._id} className={styless.classCard}>
              <div className={styless.classHeader}>
                <span className={styless.classCode}>{course.courseCode}</span>
                <span className={styless.className}>{course.courseName}</span>
                <span className={styless.classStudents}>{course.students.length} students</span>
              </div>
              <button className={styless.actionButton} onClick={() => handleSubjectClick(course)}>View Marks</button>
            </div>
          ))
        )}
      </div>
      {selectedSubject && (
        <CustomTable
          headers={["Roll No", "Student Name", "Mid Marks", "Sessional Marks", "Final Marks", "Total Marks"]}
          data={marks.map(mark => ({
            "Roll No": mark.student.rollNo,
            "Student Name": mark.student.name,
            "Mid Marks": mark.type === 'midterm' ? mark.marks : 0,
            "Sessional Marks": mark.type === 'sessional' ? mark.marks : 0,
            "Final Marks": mark.type === 'final' ? mark.marks : 0,
            "Total Marks": mark.totalMarks
          }))}
          onView={handleSaveMarks}
        />
      )}
    </div>
  );
};

export default TeacherMarks; 