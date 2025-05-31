import React, { useState } from 'react';
import styles from '../styles/pages/teacherAssignments.module.scss';

const TeacherAssignments = () => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showUploadSection, setShowUploadSection] = useState(false);

  // Mock data
  const assignments = [
    { id: 1, title: 'Programming Assignment 3', classCode: 'CSE101', due: '2024-05-15', submissions: 18, status: 'Published' },
    { id: 2, title: 'Data Structures Project', classCode: 'CSE201', due: '2024-05-20', submissions: 5, status: 'Published' },
    { id: 3, title: 'Final Project', classCode: 'CSE405', due: '2024-06-10', submissions: 0, status: 'Draft' }
  ];

  const handleCardClick = (assignment) => {
    setSelectedAssignment(assignment);
    setShowUploadSection(true);
  };

  const handleUploadAssignment = () => {
    // Logic to upload the file and store it in the database
    alert('Assignment uploaded successfully');
  };

  return (
    <div className={styles.assignmentsPage}>
      <h2>Assignments</h2>
      <div className={styles.classesList}>
        {assignments.map(assignment => (
          <div key={assignment.id} className={styles.classCard} onClick={() => handleCardClick(assignment)}>
            <div className={styles.classHeader}>
              <span className={styles.classCode}>{assignment.classCode}</span>
              <span className={styles.className}>{assignment.title}</span>
              <span className={styles.classStudents}>{assignment.submissions} submissions</span>
            </div>
          </div>
        ))}
      </div>
      {showUploadSection && selectedAssignment && (
        <div className={styles.uploadSection}>
          <h4>Upload Assignment for {selectedAssignment.title}</h4>
          <input type="file" />
          <button onClick={handleUploadAssignment}>Upload</button>
        </div>
      )}
    </div>
  );
};

export default TeacherAssignments; 