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

/**
 * @swagger
 * tags:
 *   - name: Students
 *     description: Endpoints for student operations
 */

/**
 * @swagger
 * /api/students/login:
 *   post:
 *     summary: Student login
 *     description: Allows a student to login using batch, department, roll number, and password.
 *     tags:
 *       - Students
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - batch
 *               - department
 *               - rollNo
 *               - password
 *             properties:
 *               batch:
 *                 type: string
 *                 example: FALL-23
 *               department:
 *                 type: string
 *                 enum: [BSSE, BSCS, BBA, BCE]
 *                 example: BSCS
 *               rollNo:
 *                 type: string
 *                 example: BSCS-23-101
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
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 student:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 65fae1a2b7f5deb5d4e1ce99
 *                     name:
 *                       type: string
 *                       example: Ali Khan
 *                     rollNo:
 *                       type: string
 *                       example: BSCS-23-101
 *                     batch:
 *                       type: string
 *                       example: FALL-23
 *                     semester:
 *                       type: integer
 *                       example: 5
 *                     department:
 *                       type: string
 *                       example: BSCS
 *                     email:
 *                       type: string
 *                       example: ali.khan@example.com
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/students/dashboard:
 *   get:
 *     summary: Get student's dashboard info
 *     description: Returns student's core academic information, enrolled courses, and total credits.
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard info retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 rollNo:
 *                   type: string
 *                 semester:
 *                   type: integer
 *                 cgpa:
 *                   type: number
 *                 enrolledCourses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       course:
 *                         $ref: '#/components/schemas/Course'
 *                       semester:
 *                         type: integer
 *                 totalCredits:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/students/gpa-progress:
 *   get:
 *     summary: Get GPA/CGPA progress
 *     description: Returns GPA for each semester of the student.
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: GPA progress retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   semester:
 *                     type: integer
 *                   gpa:
 *                     type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/students/courses/available:
 *   get:
 *     summary: Get available courses for student
 *     description: Lists courses available in the student's department.
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Available courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/students/courses/register:
 *   post:
 *     summary: Register for courses
 *     description: Allows student to register for multiple courses using course IDs.
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseIds
 *             properties:
 *               courseIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["66abcd12b7f5deb5d4e1cf01","66abcd12b7f5deb5d4e1cf02"]
 *     responses:
 *       200:
 *         description: Courses registered successfully
 *       400:
 *         description: Invalid course IDs
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/students/profile:
 *   get:
 *     summary: Get student profile
 *     description: Retrieves the student's profile excluding password.
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/students/profile/update:
 *   put:
 *     summary: Update student profile
 *     description: Update student's profile fields like name, email, phone, and address.
 *     tags:
 *       - Students
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
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/students/profile/change-password:
 *   put:
 *     summary: Change student password
 *     description: Change the student's password by providing current, new, and confirmation passwords.
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmNewPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Current password is incorrect
 *       500:
 *         description: Server error
 */


module.exports = router;