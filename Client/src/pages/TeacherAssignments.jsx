import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/pages/teacherAssignments.module.scss';
import { uploadAssignment } from '../features/teacherAssignments/teacherAssignmentsSlice';
import { fetchTeacherCourses } from '../features/teacherDashboard/teacherDashboardSlice';

const TeacherAssignments = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  const { isLoading, error, successMessage } = useSelector(state => state.teacherAssignments);
  const { courses } = useSelector(state => state.teacherDashboard);

  useEffect(() => {
    dispatch(fetchTeacherCourses());
  }, [dispatch]);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setShowUploadSection(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadAssignment = async (e) => {
    e.preventDefault();
    
    const file = fileInputRef.current.files[0];
    if (!file) {
      alert('Please select a file');
      return;
    }

    const assignmentData = {
      ...formData,
      courseId: selectedCourse._id,
      file: file
    };

    try {
      await dispatch(uploadAssignment(assignmentData)).unwrap();
      setFormData({
        title: '',
        description: '',
        dueDate: ''
      });
      fileInputRef.current.value = '';
    } catch (err) {
      console.error('Failed to upload assignment:', err);
    }
  };

  return (
    <div className={styles.assignmentsPage}>
      <h2>Assignments</h2>
      
      {error && <div className={styles.error}>{error}</div>}
      {successMessage && <div className={styles.success}>{successMessage}</div>}
      
      <div className={styles.classesList}>
        {isLoading ? (
          <p>Loading courses...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          courses.map(course => (
            <div 
              key={course._id} 
              className={`${styles.classCard} ${selectedCourse?._id === course._id ? styles.selected : ''}`}
              onClick={() => handleCourseClick(course)}
            >
              <div className={styles.classHeader}>
                <span className={styles.classCode}>{course.courseCode}</span>
                <span className={styles.className}>{course.courseName}</span>
                <span className={styles.classStudents}>{course.students?.length || 0} students</span>
              </div>
            </div>
          ))
        )}
      </div>

      {showUploadSection && selectedCourse && (
        <div className={styles.uploadSection}>
          <h4>Upload Assignment for {selectedCourse.courseName}</h4>
          <form onSubmit={handleUploadAssignment}>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="title"
                placeholder="Assignment Title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <textarea
                name="description"
                placeholder="Assignment Description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="file"
                ref={fileInputRef}
                required
              />
            </div>
            <button 
              type="submit" 
              className={`${styles.customButton} ${isLoading ? styles.loading : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Uploading...' : 'Upload Assignment'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherAssignments; 