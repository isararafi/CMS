const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const studentAuth = require('../middleware/studentAuth');

// ---------------------------
// Public Route - Student Login
// ---------------------------
router.post('/login', studentController.login);

// ---------------------------
// Protected Routes (require student authentication)
// ---------------------------
router.use(studentAuth);

// Dashboard / Core Academic Info
router.get('/dashboard', studentController.getDashboardInfo);
router.get('/gpa-progress', studentController.getGpaProgress); // View GPA/CGPA progress

// Course Management
router.get('/courses/available', studentController.getAvailableCourses); // View available courses
router.post('/courses/register', studentController.registerCourses); // Register for courses

// Profile Management
router.get('/profile', studentController.getProfile); // View profile
router.put('/profile/update', studentController.updateProfile); // Update profile
router.put('/profile/change-password', studentController.changePassword); // Change password

module.exports = router;