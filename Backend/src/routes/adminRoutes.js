const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

/**
 * ========================
 * Admin Authentication
 * ========================
 */
/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Endpoints for admin operations
 */
/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Register a new admin
 *     description: Creates a new admin account if the email is not already registered.
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the admin
 *                 example: Admin
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Admin email address
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Admin account password
 *                 example: password
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin registered successfully
 *                 admin:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 65f9e1a2b7f5deb5d4e1ce35
 *                     name:
 *                       type: string
 *                       example: Muhammad Shahzeb
 *                     email:
 *                       type: string
 *                       example: shahzeb@gmail.com
 *       400:
 *         description: Validation error or email already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: All fields are required
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 *                 details:
 *                   type: string
 *                   example: Internal server error message
 */
// Admin registration
router.post('/register', adminController.registerAdmin);

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin Login
 *     description: Authenticates an admin using email and password and returns a JWT token.
 *     tags:
 *       - Admin
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
 *                 format: email
 *                 description: Registered admin email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Admin account password
 *                 example: password
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
 *                   description: JWT authentication token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 message:
 *                   type: string
 *                   example: Login successful
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid credentials
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
// Admin login
router.post('/login', adminController.login);

// Protect all routes below
router.use(auth);

/**
 * ========================
 * Admin Profile
 * ========================
 */
/**
 * @swagger
 * /api/admin/me:
 *   get:
 *     summary: Get Admin Info
 *     description: Retrieves the currently authenticated admin's information. Password is excluded from the response.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 65f9e1a2b7f5deb5d4e1ce35
 *                 name:
 *                   type: string
 *                   example: Muhammad Shahzeb
 *                 email:
 *                   type: string
 *                   example: shahzeb@gmail.com
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-02-23T12:00:00.000Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-02-23T12:00:00.000Z
 *       401:
 *         description: Unauthorized, token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
router.get('/me', adminController.getAdminInfo);
/**
 * @swagger
 * /api/admin/me:
 *   patch:
 *     summary: Update Admin Profile
 *     description: Allows the currently authenticated admin to update their profile. Only `name` and `password` can be updated.
 *     tags:
 *       - Admin
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
 *                 description: New name of the admin
 *                 example: Muhammad Shahzeb
 *               password:
 *                 type: string
 *                 format: password
 *                 description: New password for the admin
 *                 example: NewStrongPassword123
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *       400:
 *         description: Invalid updates or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid updates
 *       401:
 *         description: Unauthorized, token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 */
router.patch('/me', adminController.updateProfile);

/**
 * ========================
 * Dashboard
 * ========================
 */
/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get Dashboard Statistics
 *     description: Retrieves basic dashboard statistics including the total number of students and teachers.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 studentsCount:
 *                   type: integer
 *                   example: 120
 *                   description: Total number of students
 *                 teachersCount:
 *                   type: integer
 *                   example: 15
 *                   description: Total number of teachers
 *       401:
 *         description: Unauthorized, token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
router.get('/dashboard', adminController.getDashboardStats);

/**
 * ========================
 * Student Management
 * ========================
 */
/**
 * @swagger
 * /api/admin/register/students:
 *   post:
 *     summary: Register a new student
 *     description: Creates a new student account. Validates required fields, semester range, and unique email/roll number.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - rollNo
 *               - semester
 *               - department
 *               - batch
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ali Khan
 *                 description: Full name of the student
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ali.khan@example.com
 *                 description: Student email address
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPassword123
 *                 description: Student account password
 *               rollNo:
 *                 type: string
 *                 example: BSSE-22-001
 *                 description: Unique roll number
 *               semester:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 8
 *                 example: 3
 *                 description: Semester (1-8)
 *               department:
 *                 type: string
 *                 enum: [BSSE, BSCS, BBA, BCE]
 *                 example: BSSE
 *                 description: Student department
 *               batch:
 *                 type: string
 *                 enum: [FALL-22, FALL-23, SPRING-23]
 *                 example: FALL-23
 *                 description: Batch of the student
 *     responses:
 *       201:
 *         description: Student registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Student registered successfully
 *                 student:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 65f9e1a2b7f5deb5d4e1ce35
 *                     name:
 *                       type: string
 *                       example: Ali Khan
 *                     email:
 *                       type: string
 *                       example: ali.khan@example.com
 *                     rollNo:
 *                       type: string
 *                       example: BSSE-22-001
 *                     semester:
 *                       type: integer
 *                       example: 3
 *                     department:
 *                       type: string
 *                       example: BSSE
 *                     batch:
 *                       type: string
 *                       example: FALL-23
 *       400:
 *         description: Validation error or duplicate email/roll number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Student with this email or roll number already exists
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
// Add student
router.post('/register/students', adminController.registerStudent);

/**
 * @swagger
 * api/admin/students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     description: Retrieves the details of a single student by their ID. Password field is excluded from the response.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student
 *         example: 65f9e1a2b7f5deb5d4e1ce35
 *     responses:
 *       200:
 *         description: Student retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 65f9e1a2b7f5deb5d4e1ce35
 *                 name:
 *                   type: string
 *                   example: Ali Khan
 *                 email:
 *                   type: string
 *                   example: ali.khan@example.com
 *                 rollNo:
 *                   type: string
 *                   example: BSSE-22-001
 *                 semester:
 *                   type: integer
 *                   minimum: 1
 *                   maximum: 8
 *                   example: 3
 *                 department:
 *                   type: string
 *                   enum: [BSSE, BSCS, BBA, BCE]
 *                   example: BSSE
 *                 batch:
 *                   type: string
 *                   enum: [FALL-22, FALL-23, SPRING-23]
 *                   example: FALL-23
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-02-23T12:00:00.000Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-02-23T12:00:00.000Z
 *       401:
 *         description: Unauthorized, token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Student not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
router.get('/students/:id', adminController.getStudentById);

/**
 * @swagger
 * /api/admin/students:
 *   get:
 *     summary: Get all students
 *     description: Retrieves a list of all registered students. Password field is excluded from the response.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 65f9e1a2b7f5deb5d4e1ce35
 *                   name:
 *                     type: string
 *                     example: Ali Khan
 *                   email:
 *                     type: string
 *                     example: ali.khan@example.com
 *                   rollNo:
 *                     type: string
 *                     example: BSSE-22-001
 *                   semester:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 8
 *                     example: 3
 *                   department:
 *                     type: string
 *                     enum: [BSSE, BSCS, BBA, BCE]
 *                     example: BSSE
 *                   batch:
 *                     type: string
 *                     enum: [FALL-22, FALL-23, SPRING-23]
 *                     example: FALL-23
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-02-23T12:00:00.000Z
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-02-23T12:00:00.000Z
 *       401:
 *         description: Unauthorized (if route is protected)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
// View all students
router.get('/students', adminController.getAllStudents);

/**
 * @swagger
 * /api/admin/students/{id}:
 *   patch:
 *     summary: Update a student
 *     description: "Allows admin to update a student's information. Password is excluded from the response. Use only valid fields: name, email, rollNo, semester, department, batch."
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to update
 *         example: 65f9e1a2b7f5deb5d4e1ce35
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ali Khan
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ali.khan@example.com
 *               rollNo:
 *                 type: string
 *                 example: BSSE-22-001
 *               semester:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 8
 *                 example: 4
 *               department:
 *                 type: string
 *                 enum: [BSSE, BSCS, BBA, BCE]
 *                 example: BSCS
 *               batch:
 *                 type: string
 *                 enum: [FALL-22, FALL-23, SPRING-23]
 *                 example: FALL-23
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 65f9e1a2b7f5deb5d4e1ce35
 *                 name:
 *                   type: string
 *                   example: Ali Khan
 *                 email:
 *                   type: string
 *                   example: ali.khan@example.com
 *                 rollNo:
 *                   type: string
 *                   example: BSSE-22-001
 *                 semester:
 *                   type: integer
 *                   example: 4
 *                 department:
 *                   type: string
 *                   example: BSCS
 *                 batch:
 *                   type: string
 *                   example: FALL-23
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-02-23T12:00:00.000Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-02-24T10:00:00.000Z
 *       400:
 *         description: Validation error or invalid updates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid updates
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Student not found
 */
// Update student by ID
router.patch('/students/:id', adminController.updateStudent);

/**
 * @swagger
 * /api/admin/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     description: "Allows admin to delete a student by ID."
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to delete
 *         example: 65f9e1a2b7f5deb5d4e1ce35
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Student deleted successfully
 *       401:
 *         description: Unauthorized, token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Student not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
// Delete student
router.delete('/students/:id', adminController.deleteStudent); // By ID

/**
 * ========================
 * Teacher Management
 * ========================
 */
/**
 * @swagger
 * /api/admin/teachers/register:
 *   post:
 *     summary: Register a new teacher
 *     description: Creates a new teacher account. Validates required fields and ensures the email is unique.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - education
 *               - department
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sara Ali
 *                 description: Full name of the teacher
 *               email:
 *                 type: string
 *                 format: email
 *                 example: sara.ali@example.com
 *                 description: Teacher email address
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPassword123
 *                 description: Teacher account password
 *               education:
 *                 type: string
 *                 example: MCS
 *                 description: Teacher's highest education
 *               department:
 *                 type: string
 *                 enum: [BSSE, BSCS, BBA, BCE]
 *                 example: BSSE
 *                 description: Department the teacher belongs to
 *     responses:
 *       201:
 *         description: Teacher registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Teacher registered successfully
 *                 teacher:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 65fae1a2b7f5deb5d4e1ce99
 *                     name:
 *                       type: string
 *                       example: Sara Ali
 *                     email:
 *                       type: string
 *                       example: sara.ali@example.com
 *                     education:
 *                       type: string
 *                       example: MCS
 *                     department:
 *                       type: string
 *                       enum: [BSSE, BSCS, BBA, BCE]
 *                       example: BSSE
 *       400:
 *         description: Validation error or duplicate email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email already registered
 *       401:
 *         description: Unauthorized, token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
// Add teacher
router.post('/teachers/register', adminController.registerTeacher);

/**
 * @swagger
 * /api/admin/teachers/{id}:
 *   get:
 *     summary: Get teacher by ID
 *     description: Retrieves a teacher's information by their ID. Password is excluded from the response.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the teacher to retrieve
 *         example: "65fae1a2b7f5deb5d4e1ce99"
 *     responses:
 *       200:
 *         description: Teacher retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 65fae1a2b7f5deb5d4e1ce99
 *                 name:
 *                   type: string
 *                   example: Sara Ali
 *                 email:
 *                   type: string
 *                   example: sara.ali@example.com
 *                 education:
 *                   type: string
 *                   example: MCS
 *                 department:
 *                   type: string
 *                   enum: [BSSE, BSCS, BBA, BCE]
 *                   example: BSSE
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-02-23T12:00:00.000Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-02-24T10:00:00.000Z
 *       401:
 *         description: Unauthorized, token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Teacher not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Teacher not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
router.get('/teachers/:id', adminController.getTeacherById);

/**
 * @swagger
 * /api/admin/teachers:
 *   get:
 *     summary: Get all teachers
 *     description: Retrieves a list of all teachers. Passwords are excluded from the response.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teachers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 65fae1a2b7f5deb5d4e1ce99
 *                   name:
 *                     type: string
 *                     example: Sara Ali
 *                   email:
 *                     type: string
 *                     example: sara.ali@example.com
 *                   education:
 *                     type: string
 *                     example: MCS
 *                   department:
 *                     type: string
 *                     enum: [BSSE, BSCS, BBA, BCE]
 *                     example: BSSE
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-02-23T12:00:00.000Z
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-02-24T10:00:00.000Z
 *       401:
 *         description: Unauthorized, token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
// View all teachers
router.get('/teachers', adminController.getAllTeachers);

/**
 * @swagger
 * /api/admin/teachers/{id}:
 *   patch:
 *     summary: Update a teacher
 *     description: "Allows admin to update a teacher's information. Password is excluded from the response. Use only valid fields: name, email, education, department."
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the teacher to update
 *         example: "65fae1a2b7f5deb5d4e1ce99"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sara Ali
 *               email:
 *                 type: string
 *                 format: email
 *                 example: sara.ali@example.com
 *               education:
 *                 type: string
 *                 example: MCS
 *               department:
 *                 type: string
 *                 enum: [BSSE, BSCS, BBA, BCE]
 *                 example: BSCS
 *     responses:
 *       200:
 *         description: Teacher updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 65fae1a2b7f5deb5d4e1ce99
 *                 name:
 *                   type: string
 *                   example: Sara Ali
 *                 email:
 *                   type: string
 *                   example: sara.ali@example.com
 *                 education:
 *                   type: string
 *                   example: MCS
 *                 department:
 *                   type: string
 *                   enum: [BSSE, BSCS, BBA, BCE]
 *                   example: BSCS
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-02-24T10:00:00.000Z
 *       400:
 *         description: Validation error or invalid updates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid updates
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Teacher not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Teacher not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
// Update teacher by ID
router.patch('/teachers/:id', adminController.updateTeacher);

/**
 * @swagger
 * /api/admin/teachers/{id}:
 *   delete:
 *     summary: Delete a teacher
 *     description: Allows admin to delete a teacher by their ID.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the teacher to delete
 *         example: "65fae1a2b7f5deb5d4e1ce99"
 *     responses:
 *       200:
 *         description: Teacher deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Teacher deleted successfully
 *       401:
 *         description: Unauthorized, token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Teacher not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Teacher not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
// Delete teacher
router.delete('/teachers/:id', adminController.deleteTeacher); // By ID

/**
 * ========================
 * Course Management
 * ========================
 */
/**
 * @swagger
 * /api/admin/courses:
 *   post:
 *     summary: Create a new course
 *     description: Allows admin to create a new course. All fields are required. Each course must have a unique course code and a valid teacher assigned.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseName
 *               - courseCode
 *               - creditHours
 *               - department
 *               - teacherId
 *             properties:
 *               courseName:
 *                 type: string
 *                 example: Data Structures
 *               courseCode:
 *                 type: string
 *                 example: CS201
 *               creditHours:
 *                 type: integer
 *                 example: 3
 *               department:
 *                 type: string
 *                 enum: [BSSE, BSCS, BBA, BCE]
 *                 example: BSCS
 *               teacherId:
 *                 type: string
 *                 example: 65fae1a2b7f5deb5d4e1ce99
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Course created successfully
 *                 course:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 66abcd12b7f5deb5d4e1cf01
 *                     courseName:
 *                       type: string
 *                       example: Data Structures
 *                     courseCode:
 *                       type: string
 *                       example: CS201
 *                     creditHours:
 *                       type: integer
 *                       example: 3
 *                     department:
 *                       type: string
 *                       enum: [BSSE, BSCS, BBA, BCE]
 *                       example: BSCS
 *                     teacher:
 *                       type: string
 *                       example: 65fae1a2b7f5deb5d4e1ce99
 *       400:
 *         description: Validation error or duplicate course code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Course with this code already exists
 *       401:
 *         description: Unauthorized, token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Teacher not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Teacher not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
// Create course (assign teacher here)
router.post('/courses', adminController.createCourse);

/**
 * @swagger
 * /api/admin/courses:
 *   get:
 *     summary: Get all courses
 *     description: Retrieves a list of all courses with their assigned teacher and enrolled students. Passwords are excluded from the response.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 66abcd12b7f5deb5d4e1cf01
 *                   courseName:
 *                     type: string
 *                     example: Data Structures
 *                   courseCode:
 *                     type: string
 *                     example: CS201
 *                   creditHours:
 *                     type: integer
 *                     example: 3
 *                   department:
 *                     type: string
 *                     enum: [BSSE, BSCS, BBA, BCE]
 *                     example: BSCS
 *                   teacher:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 65fae1a2b7f5deb5d4e1ce99
 *                       name:
 *                         type: string
 *                         example: Sara Ali
 *                       email:
 *                         type: string
 *                         example: sara.ali@example.com
 *                   students:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 65fbf2a3c7f5deb5d4e1cf12
 *                         name:
 *                           type: string
 *                           example: Ali Khan
 *                         rollNo:
 *                           type: string
 *                           example: BSSE-22-001
 *       401:
 *         description: Unauthorized, token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
// View all courses
router.get('/courses', adminController.getAllCourses);

/**
 * @swagger
 * /api/admin/courses/{id}:
 *   patch:
 *     summary: Update a course
 *     description: Allows admin to update a course's information. You can update courseName, courseCode, creditHours, department, and teacherId. Populated teacher info will be returned. 
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to update
 *         example: "66abcd12b7f5deb5d4e1cf01"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseName:
 *                 type: string
 *                 example: Data Structures
 *               courseCode:
 *                 type: string
 *                 example: CS201
 *               creditHours:
 *                 type: integer
 *                 example: 3
 *               department:
 *                 type: string
 *                 enum: [BSSE, BSCS, BBA, BCE]
 *                 example: BSCS
 *               teacherId:
 *                 type: string
 *                 example: 65fae1a2b7f5deb5d4e1ce99
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Course updated successfully
 *                 course:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 66abcd12b7f5deb5d4e1cf01
 *                     courseName:
 *                       type: string
 *                       example: Data Structures
 *                     courseCode:
 *                       type: string
 *                       example: CS201
 *                     creditHours:
 *                       type: integer
 *                       example: 3
 *                     department:
 *                       type: string
 *                       enum: [BSSE, BSCS, BBA, BCE]
 *                       example: BSCS
 *                     teacher:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 65fae1a2b7f5deb5d4e1ce99
 *                         name:
 *                           type: string
 *                           example: Sara Ali
 *                         email:
 *                           type: string
 *                           example: sara.ali@example.com
 *       400:
 *         description: Validation error or invalid updates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid updates
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Course or Teacher not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Course not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
// Update course (including teacher assignment)
router.patch('/courses/:id', adminController.updateCourse);

/**
 * @swagger
 * /api/admin/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     description: Allows admin to delete a course by its ID. Returns the deleted course object.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to delete
 *         example: "66abcd12b7f5deb5d4e1cf01"
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Course deleted successfully
 *                 deletedCourse:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 66abcd12b7f5deb5d4e1cf01
 *                     courseName:
 *                       type: string
 *                       example: Data Structures
 *                     courseCode:
 *                       type: string
 *                       example: CS201
 *                     creditHours:
 *                       type: integer
 *                       example: 3
 *                     department:
 *                       type: string
 *                       enum: [BSSE, BSCS, BBA, BCE]
 *                       example: BSCS
 *                     teacher:
 *                       type: string
 *                       example: 65fae1a2b7f5deb5d4e1ce99
 *       401:
 *         description: Unauthorized, token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Course not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
// Delete course
router.delete('/courses/:id', adminController.deleteCourse);

module.exports = router;