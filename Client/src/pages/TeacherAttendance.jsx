import React, { useState, useEffect } from 'react';
import styles from '../styles/pages/teacherAttendance.module.scss';
import ApiHandler from '../services/apiHandler';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherCourses } from '../features/teacherDashboard/teacherDashboardSlice';

const TeacherAttendance = () => {
  const dispatch = useDispatch();
  const { courses, isLoading, error } = useSelector(state => state.teacherDashboard);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lectures, setLectures] = useState([
    { id: 1, title: 'Complexity Analysis', date: '2025-06-03', courseId: 1, description: 'Time and Space complexity deep dive' }
  ]);
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', regNo: 'STU001' },
    { id: 2, name: 'Jane Smith', regNo: 'STU002' },
    { id: 3, name: 'Alice Johnson', regNo: 'STU003' }
  ]);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showDeleteSection, setShowDeleteSection] = useState(false);
  const [newLecture, setNewLecture] = useState({ title: '', date: '', courseId: '', description: '' });
  const [attendance, setAttendance] = useState({});
  const [selectedLectures, setSelectedLectures] = useState([]);

  useEffect(() => {
    dispatch(fetchTeacherCourses());
  }, [dispatch]);

  const toggleAddSection = (course) => {
    setSelectedCourse(course);
    setShowAddSection(!showAddSection);
    setShowDeleteSection(false);
  };

  const toggleDeleteSection = (course) => {
    setSelectedCourse(course);
    setShowDeleteSection(!showDeleteSection);
    setShowAddSection(false);
  };

  const handleAddLecture = () => {
    const newId = lectures.length + 1;
    const newLectureData = { ...newLecture, id: newId, courseId: selectedCourse.id };
    setLectures([...lectures, newLectureData]);
    setNewLecture({ title: '', date: '', courseId: '', description: '' });
  };

  const handleAttendanceChange = (studentId) => {
    setAttendance({ ...attendance, [studentId]: !attendance[studentId] });
  };

  const handleSaveAttendance = (lectureId) => {
    alert('Attendance saved successfully');
  };

  const handleLectureSelect = (lectureId) => {
    setSelectedLectures(prev => prev.includes(lectureId) ? prev.filter(id => id !== lectureId) : [...prev, lectureId]);
  };

  const handleDeleteLectures = () => {
    setLectures(prev => prev.filter(lecture => !selectedLectures.includes(lecture.id)));
    setSelectedLectures([]);
  };

  return (
    <div className={styles.attendancePage}>
      <h2>Attendance</h2>
      <div className={styles.classesList}>
        {isLoading ? (
          <p>Loading courses...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          courses.map(course => (
            <div key={course._id} className={styles.classCard}>
              <div className={styles.classHeader}>
                <span className={styles.classCode}>{course.courseCode}</span>
                <span className={styles.className}>{course.courseName}</span>
                <span className={styles.classStudents}>{course.students.length} students</span>
              </div>
              <button className={styles.actionButton} onClick={() => toggleAddSection(course)}>+</button>
              <button className={styles.actionButton} onClick={() => toggleDeleteSection(course)}>-</button>
            </div>
          ))
        )}
      </div>
      {showAddSection && selectedCourse && (
        <div className={styles.addSection}>
          <h4>Add Lecture</h4>
          <input type="text" placeholder="Title" value={newLecture.title} onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value })} />
          <input type="date" value={newLecture.date} onChange={(e) => setNewLecture({ ...newLecture, date: e.target.value })} />
          <div className={styles.customTable}>
            <h5>Mark Attendance</h5>
            {students.map(student => (
              <div key={student.id} className={styles.tableRow}>
                <span>{student.regNo}</span>
                <span>{student.name}</span>
                <input type="checkbox" checked={!!attendance[student.id]} onChange={() => handleAttendanceChange(student.id)} />
              </div>
            ))}
          </div>
          <button onClick={handleAddLecture}>Save</button>
        </div>
      )}
      {showDeleteSection && selectedCourse && (
        <div className={styles.deleteSection}>
          <h4>Delete Lectures</h4>
          <div className={styles.customTable}>
            {lectures.map(lecture => (
              <div key={lecture.id} className={styles.tableRow}>
                <span>{lecture.title}</span>
                <span>{lecture.date}</span>
                <input type="checkbox" checked={selectedLectures.includes(lecture.id)} onChange={() => handleLectureSelect(lecture.id)} />
              </div>
            ))}
          </div>
          <button onClick={handleDeleteLectures}>Delete Selected Lectures</button>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendance; 