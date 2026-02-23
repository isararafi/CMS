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

/**
 * @swagger
 * tags:
 *   - name: Teachers
 *     description: Endpoints for teacher operations
 */

/**
 * @swagger
 * /api/teachers/login:
 *   post:
 *     summary: Teacher login
 *     description: Allows a teacher to login using email and password.
 *     tags:
 *       - Teachers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: teacher@example.com
 *               password:
 *                 type: string
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 teacher:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     department:
 *                       type: string
 *                       enum: [BSSE, BSCS, BBA, BCE]
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/teachers/profile:
 *   get:
 *     summary: Get teacher profile
 *     description: Retrieves teacher profile excluding password.
 *     tags:
 *       - Teachers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teacher profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update teacher profile
 *     description: Update teacher's name, email, education, or department.
 *     tags:
 *       - Teachers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               education:
 *                 type: string
 *               department:
 *                 type: string
 *                 enum: [BSSE, BSCS, BBA, BCE]
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/teachers/courses:
 *   get:
 *     summary: Get courses assigned to teacher
 *     description: Lists all courses assigned to the logged-in teacher with enrolled students.
 *     tags:
 *       - Teachers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseWithStudents'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/teachers/students/{courseId}:
 *   get:
 *     summary: Get students for a course
 *     description: Lists all students enrolled in a specific course assigned to the teacher.
 *     tags:
 *       - Teachers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courseId:
 *                   type: string
 *                 courseName:
 *                   type: string
 *                 students:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StudentBasic'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found or not authorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/teachers/students/{courseId}/marks:
 *   post:
 *     summary: Add or update marks for students
 *     description: Allows a teacher to add or update marks for students in a specific course.
 *     tags:
 *       - Teachers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - marks
 *             properties:
 *               marks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - studentId
 *                     - marks
 *                   properties:
 *                     studentId:
 *                       type: string
 *                     marks:
 *                       type: number
 *     responses:
 *       200:
 *         description: Marks added/updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found or not authorized
 *       500:
 *         description: Server error
 */

module.exports = router;