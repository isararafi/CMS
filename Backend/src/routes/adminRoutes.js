const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');


// Registration
router.post('/register/admin', adminController.registerAdmin);


// Admin Authentication
router.post('/login', adminController.login);

// Protected Routes (require authentication)
router.use(auth);

// Registration
router.post('/register/student', adminController.registerStudent);
router.post('/register/teacher', adminController.registerTeacher);

// Admin Profile
router.get('/profile', adminController.getAdminInfo);
router.patch('/profile', adminController.updateProfile);

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

// Student Management
router.post('/students', adminController.addStudent);
router.get('/students', adminController.getAllStudents);
router.patch('/students/:id', adminController.updateStudent);
router.delete('/students/:id', adminController.deleteStudent);
router.delete('/students', adminController.deleteStudent); // Alternative delete by batch, rollNo, department

// Teacher Management
router.post('/teachers', adminController.addTeacher);
router.get('/teachers', adminController.getAllTeachers);
router.patch('/teachers/:id', adminController.updateTeacher);
router.delete('/teachers/:id', adminController.deleteTeacher);
router.delete('/teachers', adminController.deleteTeacher); // Alternative delete by email

// Course Management
router.post('/courses', adminController.createCourse);
router.get('/courses', adminController.getAllCourses);
router.patch('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);

module.exports = router; 