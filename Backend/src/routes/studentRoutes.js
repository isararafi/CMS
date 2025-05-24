const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const studentAuth = require('../middleware/studentAuth');

// Student Authentication
router.post('/login', studentController.login);

// Protected Routes (require student authentication)
router.use(studentAuth);

// Dashboard
router.get('/dashboard', studentController.getDashboardInfo);
router.get('/gpa-progress', studentController.getGpaProgress);

// Course Management
router.get('/courses/available', studentController.getAvailableCourses);
router.post('/courses/register', studentController.registerCourses);

// Marks
router.get('/courses/:courseId/marks', studentController.getCourseMarks);

// Attendance
router.get('/courses/:courseId/attendance/summary', studentController.getCourseAttendanceSummary);
router.get('/courses/:courseId/attendance/detailed', studentController.getDetailedCourseAttendance);

// Results
router.get('/results/:semester', studentController.getSemesterResult);

// Fee Management
router.get('/fees/history', studentController.getFeeHistory);
router.get('/fees/current-challan', studentController.getCurrentFeeChallan);

// Assignments
router.get('/assignments', studentController.getAssignments);

// Profile Management
router.get('/profile', studentController.getProfile);
router.post('/profile/update-request', studentController.requestProfileUpdate);
router.put('/profile/change-password', studentController.changePassword);

module.exports = router; 