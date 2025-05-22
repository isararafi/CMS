import React from 'react';
import styles from '../styles/pages/teacherAssignments.module.scss';

const TeacherAssignments = () => {
  // Mock data
  const assignments = [
    { id: 1, title: 'Programming Assignment 3', classCode: 'CSE101', due: '2024-05-15', submissions: 18, status: 'Published' },
    { id: 2, title: 'Data Structures Project', classCode: 'CSE201', due: '2024-05-20', submissions: 5, status: 'Published' },
    { id: 3, title: 'Final Project', classCode: 'CSE405', due: '2024-06-10', submissions: 0, status: 'Draft' }
  ];
  return (
    <div className={styles.assignmentsPage}>
      <h2>Assignments</h2>
      <table className={styles.assignmentsTable}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Class</th>
            <th>Due Date</th>
            <th>Submissions</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map(a => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.classCode}</td>
              <td>{a.due}</td>
              <td>{a.submissions}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherAssignments; 