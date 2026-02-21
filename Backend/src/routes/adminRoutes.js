const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

/**
 * ========================
 * Admin Authentication
 * ========================
 */
// Admin registration
router.post('/register/admin', adminController.registerAdmin);

// Admin login
router.post('/login', adminController.login);

// Protect all routes below
router.use(auth);

/**
 * ========================
 * Admin Profile
 * ========================
 */
router.get('/profile', adminController.getAdminInfo);
router.patch('/profile', adminController.updateProfile);

/**
 * ========================
 * Dashboard
 * ========================
 */
router.get('/dashboard/stats', adminController.getDashboardStats);

/**
 * ========================
 * Student Management
 * ========================
 */
// Add student
router.post('/students', adminController.registerStudent);

router.get('/students/:id', adminController.getStudentById);

// View all students
router.get('/students', adminController.getAllStudents);

// Update student by ID
router.patch('/students/:id', adminController.updateStudent);

// Delete student
router.delete('/students/:id', adminController.deleteStudent); // By ID

/**
 * ========================
 * Teacher Management
 * ========================
 */
// Add teacher
router.post('/teachers', adminController.registerTeacher);

router.get('/teachers/:id', adminController.getTeacherById);

// View all teachers
router.get('/teachers', adminController.getAllTeachers);

// Update teacher by ID
router.patch('/teachers/:id', adminController.updateTeacher);

// Delete teacher
router.delete('/teachers/:id', adminController.deleteTeacher); // By ID

/**
 * ========================
 * Course Management
 * ========================
 */
// Create course (assign teacher here)
router.post('/courses', adminController.createCourse);

// View all courses
router.get('/courses', adminController.getAllCourses);

// Update course (including teacher assignment)
router.patch('/courses/:id', adminController.updateCourse);

// Delete course
router.delete('/courses/:id', adminController.deleteCourse);

module.exports = router;