import React, { useState } from 'react';
import styles from '../styles/pages/teacherMarks.module.scss';

const TeacherMarks = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, code: 'CSE101', name: 'Intro to Programming' },
    { id: 2, code: 'CSE201', name: 'Data Structures' }
  ]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([
    { id: 1, rollNo: 'STU001', name: 'Alice', midMarks: 0, sessionalMarks: 0, finalMarks: 0 },
    { id: 2, rollNo: 'STU002', name: 'Bob', midMarks: 0, sessionalMarks: 0, finalMarks: 0 },
    { id: 3, rollNo: 'STU003', name: 'Charlie', midMarks: 0, sessionalMarks: 0, finalMarks: 0 }
  ]);

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
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
    alert('Marks saved successfully');
  };

  return (
    <div className={styles.marksPage}>
      <h2>Marks Entry</h2>
      <div className={styles.subjectsList}>
        {subjects.map(subject => (
          <div key={subject.id} className={styles.subjectCard} onClick={() => handleSubjectClick(subject)}>
            <span>{subject.code}</span>
            <span>{subject.name}</span>
            <span className={styles.subjectStudents}>{students.length} students</span>
          </div>
        ))}
      </div>
      {selectedSubject && (
        <div className={styles.marksTableContainer}>
          <h3>Marks for {selectedSubject.name}</h3>
          <table className={styles.marksTable}>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Mid Marks</th>
                <th>Sessional Marks</th>
                <th>Final Marks</th>
                <th>Total Marks</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.rollNo}</td>
                  <td>{student.name}</td>
                  <td><input type="number" value={student.midMarks} onChange={(e) => handleMarksChange(student.id, 'midMarks', parseInt(e.target.value) || 0)} /></td>
                  <td><input type="number" value={student.sessionalMarks} onChange={(e) => handleMarksChange(student.id, 'sessionalMarks', parseInt(e.target.value) || 0)} /></td>
                  <td><input type="number" value={student.finalMarks} onChange={(e) => handleMarksChange(student.id, 'finalMarks', parseInt(e.target.value) || 0)} /></td>
                  <td>{calculateTotal(student)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSaveMarks}>Add</button>
        </div>
      )}
    </div>
  );
};

export default TeacherMarks; 