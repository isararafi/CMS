import React, { useState, useEffect } from 'react';
import styles from '../styles/pages/teacherAttendance.module.scss';
import ApiHandler from '../services/apiHandler';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherCourses, addLecture, fetchStudents, markAttendance, fetchLectures } from '../features/teacherDashboard/teacherDashboardSlice';

const TeacherAttendance = () => {
  const dispatch = useDispatch();
  const { courses, isLoading, error, students, lectures = [] } = useSelector(state => state.teacherDashboard);
  const [selectedCourse, setSelectedCourse] = useState(null);
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
    if (!showAddSection) {
      dispatch(fetchStudents(course._id));
    }
  };

  const toggleDeleteSection = (course) => {
    setSelectedCourse(course);
    setShowDeleteSection(!showDeleteSection);
    setShowAddSection(false);
    if (!showDeleteSection) {
      dispatch(fetchLectures(course._id));
    }
  };

  const handleAddLecture = () => {
    const newLectureData = { ...newLecture, courseId: selectedCourse._id };
    dispatch(addLecture(newLectureData));
    setNewLecture({ title: '', date: '', courseId: '', description: '' });
  };

  const handleAttendanceChange = (studentId) => {
    setAttendance({ ...attendance, [studentId]: !attendance[studentId] });
  };

  const handleSave = () => {
    const newLectureData = { ...newLecture, courseId: selectedCourse._id };
    dispatch(addLecture(newLectureData)).then((action) => {
      if (action.type === 'teacherDashboard/addLecture/fulfilled') {
        const lectureId = action.payload._id;
        const attendanceData = students?.students?.map(student => ({
          studentId: student._id,
          status: attendance[student._id] ? 'present' : 'absent'
        }));
        if (attendanceData) {
          dispatch(markAttendance({ lectureId, attendanceData }));
          alert('Lecture and attendance saved successfully');
        }
      }
    });
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
          courses && courses.map(course => (
            <div key={course._id} className={styles.classCard}>
              <div className={styles.classHeader}>
                <span className={styles.classCode}>{course.courseCode}</span>
                <span className={styles.className}>{course.courseName}</span>
                <span className={styles.classStudents}>{course.students?.length || 0} students</span>
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
            {students?.students && students.students.map(student => (
              <div key={student._id} className={styles.tableRow}>
                <span>{student.rollNo}</span>
                <span>{student.name}</span>
                <input type="checkbox" checked={!!attendance[student._id]} onChange={() => handleAttendanceChange(student._id)} />
              </div>
            ))}
          </div>
          <button onClick={handleSave}>Add</button>
        </div>
      )}
      {showDeleteSection && selectedCourse && (
        <div className={styles.deleteSection}>
          <h4>Lectures</h4>
          <div className={styles.customTable}>
            {lectures.map(lecture => (
              <div key={lecture._id} className={styles.tableRow}>
                <span>{lecture.title}</span>
                <span>{lecture.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendance; 