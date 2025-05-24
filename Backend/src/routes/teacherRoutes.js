const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const teacherAuth = require('../middleware/teacherAuth');
const upload = require('../middleware/upload');

// Teacher Authentication
router.post('/login', teacherController.login);

// Protected Routes (require teacher authentication)
router.use(teacherAuth);

// Teacher Profile
router.get('/profile', teacherController.getProfile);
router.post('/profile/update-request', teacherController.requestProfileUpdate);
router.get('/profile/update-requests', teacherController.getProfileUpdateRequests);

// Course Management
router.get('/courses', teacherController.getCourses);

// Lecture Management
router.post('/lectures', teacherController.addLecture);
router.get('/courses/:courseId/lectures', teacherController.getLectures);

// Attendance Management
router.post('/attendance/mark', teacherController.markAttendance);
router.get('/attendance/lecture/:lectureId', teacherController.getAttendance);

// Marks Management
router.post('/marks', teacherController.addOrUpdateMarks);
router.get('/courses/:courseId/marks', teacherController.getMarks);

// Assignment Management
router.post('/assignments/upload', upload.single('assignmentFile'), teacherController.uploadAssignment);
router.get('/courses/:courseId/assignments', teacherController.getAssignments);

module.exports = router; 