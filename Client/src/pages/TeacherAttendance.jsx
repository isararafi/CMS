import React from 'react';
import styles from '../styles/pages/teacherAttendance.module.scss';

const TeacherAttendance = () => {
  // Mock data
  const classes = [
    { id: 1, code: 'CSE101', name: 'Intro to Programming', students: 35 },
    { id: 2, code: 'CSE201', name: 'Data Structures', students: 28 },
    { id: 3, code: 'CSE405', name: 'Adv. Software Eng.', students: 22 }
  ];
  const attendanceRecords = [
    { date: '2024-05-01', classCode: 'CSE101', present: 33, absent: 2 },
    { date: '2024-05-01', classCode: 'CSE201', present: 27, absent: 1 }
  ];
  return (
    <div className={styles.attendancePage}>
      <h2>Attendance</h2>
      <div className={styles.classesList}>
        {classes.map(cls => (
          <div key={cls.id} className={styles.classCard}>
            <div className={styles.classHeader}>
              <span className={styles.classCode}>{cls.code}</span>
              <span className={styles.className}>{cls.name}</span>
              <span className={styles.classStudents}>{cls.students} students</span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.attendanceRecords}>
        <h3>Recent Attendance Records</h3>
        <table className={styles.attendanceTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Class</th>
              <th>Present</th>
              <th>Absent</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((rec, idx) => (
              <tr key={idx}>
                <td>{rec.date}</td>
                <td>{rec.classCode}</td>
                <td>{rec.present}</td>
                <td>{rec.absent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherAttendance; 