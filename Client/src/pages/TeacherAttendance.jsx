import React, { useState, useEffect } from 'react';
import styles from '../styles/pages/teacherAttendance.module.scss';
import ApiHandler from '../services/apiHandler';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherCourses, addLecture, fetchStudents, markAttendance, fetchLectures } from '../features/teacherDashboard/teacherDashboardSlice';
import { useToast } from '../context/ToastContext';

const TeacherAttendance = () => {
  const dispatch = useDispatch();
  const { courses, isLoading, error, students, lectures = [] } = useSelector(state => state.teacherDashboard);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showDeleteSection, setShowDeleteSection] = useState(false);
  const [newLecture, setNewLecture] = useState({ title: '', date: '', courseId: '', description: '' });
  const [attendance, setAttendance] = useState({});
  const [selectedLectures, setSelectedLectures] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchTeacherCourses()).unwrap();
        showToast('Courses loaded successfully', 'success');
      } catch (error) {
        showToast(error.message || 'Failed to load courses', 'error');
      }
    };
    
    fetchData();
  }, [dispatch]);

  const toggleAddSection = async (course) => {
    setSelectedCourse(course);
    setShowAddSection(!showAddSection);
    setShowDeleteSection(false);
    if (!showAddSection) {
      try {
        await dispatch(fetchStudents(course._id)).unwrap();
        showToast('Students list loaded successfully', 'success');
      } catch (error) {
        showToast('Failed to load students list', 'error');
      }
    }
  };

  const toggleDeleteSection = async (course) => {
    setSelectedCourse(course);
    setShowDeleteSection(!showDeleteSection);
    setShowAddSection(false);
    if (!showDeleteSection) {
      try {
        await dispatch(fetchLectures(course._id)).unwrap();
        showToast('Lectures loaded successfully', 'success');
      } catch (error) {
        showToast('Failed to load lectures', 'error');
      }
    }
  };

  const handleAddLecture = async () => {
    try {
      const newLectureData = { ...newLecture, courseId: selectedCourse._id };
      await dispatch(addLecture(newLectureData)).unwrap();
      showToast('Lecture added successfully', 'success');
      setNewLecture({ title: '', date: '', courseId: '', description: '' });
    } catch (error) {
      showToast(error.message || 'Failed to add lecture', 'error');
    }
  };

  const handleAttendanceChange = (studentId) => {
    setAttendance({ ...attendance, [studentId]: !attendance[studentId] });
  };

  const handleMarkAttendance = async () => {
    try {
      await dispatch(markAttendance({
        courseId: selectedCourse._id,
        attendance: Object.entries(attendance).map(([studentId, isPresent]) => ({
          studentId,
          isPresent
        }))
      })).unwrap();
      showToast('Attendance marked successfully', 'success');
      setAttendance({});
    } catch (error) {
      showToast(error.message || 'Failed to mark attendance', 'error');
    }
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
              <button className={styles.actionButton} onClick={() => toggleAddSection(course)}>Add</button>
              <button className={styles.actionButton} onClick={() => toggleDeleteSection(course)}>View</button>
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
          <button className={styles.addButton} onClick={handleAddLecture}>Add</button>
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