const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const teacherAuth = require('../middleware/teacherAuth');

// ---------------------------
// Public Routes
// ---------------------------

// Teacher Authentication
// Login
router.post('/login', teacherController.login);

// ---------------------------
// Protected Routes (require teacher authentication)
// ---------------------------
router.use(teacherAuth);

// Profile Management
router.get('/profile', teacherController.getProfile);          // View profile
router.put('/profile', teacherController.updateProfile);       // Update profile

// Course Management
router.get('/courses', teacherController.getCourses);          // Get courses assigned to teacher

// Student Management
router.get('/students/:courseId', teacherController.getStudentsForCourse); // Students for a specific course
router.post('/students/:courseId/marks', teacherController.addOrUpdateMarks); // Add/Update marks for students

module.exports = router;