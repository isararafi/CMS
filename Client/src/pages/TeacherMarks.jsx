import React from 'react';
import styles from '../styles/pages/teacherMarks.module.scss';

const TeacherMarks = () => {
  // Mock data
  const marksData = [
    { id: 1, classCode: 'CSE101', student: 'Alice', assignment: 'Assignment 1', marks: 18, total: 20 },
    { id: 2, classCode: 'CSE101', student: 'Bob', assignment: 'Assignment 1', marks: 15, total: 20 },
    { id: 3, classCode: 'CSE201', student: 'Charlie', assignment: 'Quiz 1', marks: 8, total: 10 }
  ];
  return (
    <div className={styles.marksPage}>
      <h2>Marks Entry</h2>
      <table className={styles.marksTable}>
        <thead>
          <tr>
            <th>Class</th>
            <th>Student</th>
            <th>Assignment</th>
            <th>Marks</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {marksData.map(row => (
            <tr key={row.id}>
              <td>{row.classCode}</td>
              <td>{row.student}</td>
              <td>{row.assignment}</td>
              <td>{row.marks}</td>
              <td>{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherMarks; 