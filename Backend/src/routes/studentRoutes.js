const express = require('express');
const router = express.Router();
const { getStudentByRollNo, createStudent } = require('../controllers/studentController');

// Get student information by roll number
router.get('/:rollNo', getStudentByRollNo);

// Create student (for testing purposes)
router.post('/', createStudent);

module.exports = router; 