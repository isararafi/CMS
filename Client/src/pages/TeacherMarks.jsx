import React, { useState, useEffect } from 'react';
import styles from '../styles/pages/teacherMarks.module.scss';
import styless from '../styles/pages/teacherAttendance.module.scss';
import CustomTable from '../components/common/CustomTable';

const TeacherMarks = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [studentsMarks, setStudentsMarks] = useState([]);

  // Mock data
  const courses = [
    { _id: 1, courseCode: 'CS101', courseName: 'Programming Fundamentals', students: [1,2,3] },
    { _id: 2, courseCode: 'CS102', courseName: 'Data Structures', students: [1,2] },
    { _id: 3, courseCode: 'CS103', courseName: 'Databases', students: [1] }
  ];

  const studentsData = {
    1: [
      { _id: 's1', rollNo: 'BSSE-F23-001', name: 'Ali Khan' },
      { _id: 's2', rollNo: 'BSSE-F23-002', name: 'Sara Ahmed' },
      { _id: 's3', rollNo: 'BSSE-F23-003', name: 'Usman Iqbal' }
    ],
    2: [
      { _id: 's1', rollNo: 'BSSE-F23-001', name: 'Ali Khan' },
      { _id: 's2', rollNo: 'BSSE-F23-002', name: 'Sara Ahmed' }
    ],
    3: [
      { _id: 's1', rollNo: 'BSSE-F23-001', name: 'Ali Khan' }
    ]
  };

  useEffect(() => {
    // When type or subject changes, initialize marks
    if (selectedSubject && selectedType) {
      const students = studentsData[selectedSubject._id] || [];
      setStudentsMarks(
        students.map(student => ({
          studentId: student._id,
          rollNo: student.rollNo,
          name: student.name,
          marks: 0
        }))
      );
    }
  }, [selectedSubject, selectedType]);

  const handleSubjectClick = (course) => {
    setSelectedSubject(course);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleMarksChange = (studentId, newMarks) => {
    const maxMarks = getMaxMarks(selectedType);
    const validMarks = Math.min(Math.max(0, Number(newMarks || 0)), maxMarks);

    setStudentsMarks(prev =>
      prev.map(student =>
        student.studentId === studentId
          ? { ...student, marks: validMarks }
          : student
      )
    );
  };

  const handleSaveAllMarks = () => {
    console.log('Marks saved:', studentsMarks);
    alert('Marks saved successfully!');
  };

  const getMaxMarks = (type) => {
    switch (type) {
      case 'midterm': return 25;
      case 'sessional': return 25;
      case 'final': return 50;
      default: return 0;
    }
  };

  return (
    <div className={styles.marksPage}>
      <h2>Marks Entry</h2>

      {/* Mark Type Selection */}
      <div className={styles.markTypes}>
        {['sessional', 'midterm', 'final'].map(type => (
          <button
            key={type}
            className={`${styles.typeButton} ${selectedType === type ? styles.active : ''}`}
            onClick={() => handleTypeSelect(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Courses List */}
      <div className={styless.classesList}>
        {courses.map(course => (
          <div
            key={course._id}
            className={`${styless.classCard} ${selectedSubject?._id === course._id ? styles.selected : ''}`}
            onClick={() => handleSubjectClick(course)}
          >
            <div className={styless.classHeader}>
              <span className={styless.classCode}>{course.courseCode}</span>
              <span className={styless.className}>{course.courseName}</span>
              <span className={styless.classStudents}>{course.students.length} students</span>
            </div>
          </div>
        ))}
      </div>

      {/* Marks Table */}
      {selectedSubject && selectedType && studentsMarks.length > 0 && (
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