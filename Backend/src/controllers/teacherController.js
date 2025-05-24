const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const Assignment = require('../models/Assignment');
const TeacherUpdateRequest = require('../models/TeacherUpdateRequest');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Teacher Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const teacher = await Teacher.findOne({ email });

        if (!teacher || !(await bcrypt.compare(password, teacher.password))) {
            return res.status(401).json({ error: 'Invalid credentials. Please recheck.' });
        }

        const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.json({ 
            token, 
            message: 'Login successful',
            teacher: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                department: teacher.department
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get Teacher's Courses
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ teacher: req.teacher._id })
            .populate('students', 'name rollNo email');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Add Lecture Topic
exports.addLecture = async (req, res) => {
    try {
        const { title, date, courseId, description } = req.body;

        if (!title || !date || !courseId) {
            return res.status(400).json({ error: 'Title, date, and course are required' });
        }

        // Verify the course belongs to the teacher
        const course = await Course.findOne({ _id: courseId, teacher: req.teacher._id });
        if (!course) {
            return res.status(404).json({ error: 'Course not found or unauthorized' });
        }

        const lecture = new Lecture({
            title,
            date,
            course: courseId,
            teacher: req.teacher._id,
            description
        });

        await lecture.save();
        res.status(201).json(lecture);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Lectures for a Course
exports.getLectures = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Verify the course belongs to the teacher
        const course = await Course.findOne({ _id: courseId, teacher: req.teacher._id });
        if (!course) {
            return res.status(404).json({ error: 'Course not found or unauthorized' });
        }

        const lectures = await Lecture.find({ course: courseId })
            .sort({ date: -1 });
        res.json(lectures);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Mark Attendance
exports.markAttendance = async (req, res) => {
    try {
        const { lectureId, attendanceData } = req.body;

        if (!lectureId || !attendanceData || !Array.isArray(attendanceData)) {
            return res.status(400).json({ error: 'Lecture ID and attendance data are required' });
        }

        // Verify the lecture belongs to the teacher
        const lecture = await Lecture.findOne({ _id: lectureId, teacher: req.teacher._id })
            .populate('course');
        
        if (!lecture) {
            return res.status(404).json({ error: 'Lecture not found or unauthorized' });
        }

        const attendancePromises = attendanceData.map(async ({ studentId, status }) => {
            return await Attendance.findOneAndUpdate(
                { student: studentId, lecture: lectureId },
                {
                    student: studentId,
                    lecture: lectureId,
                    course: lecture.course._id,
                    teacher: req.teacher._id,
                    status,
                    date: lecture.date
                },
                { upsert: true, new: true }
            );
        });

        await Promise.all(attendancePromises);
        res.json({ message: 'Attendance marked successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Attendance for a Lecture
exports.getAttendance = async (req, res) => {
    try {
        const { lectureId } = req.params;

        // Verify the lecture belongs to the teacher
        const lecture = await Lecture.findOne({ _id: lectureId, teacher: req.teacher._id });
        if (!lecture) {
            return res.status(404).json({ error: 'Lecture not found or unauthorized' });
        }

        const attendance = await Attendance.find({ lecture: lectureId })
            .populate('student', 'name rollNo email');
        
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Add or Update Marks
exports.addOrUpdateMarks = async (req, res) => {
    try {
        const { studentId, courseId, type, marks, totalMarks, examDate } = req.body;

        if (!studentId || !courseId || !type || marks === undefined || !totalMarks || !examDate) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Verify the course belongs to the teacher
        const course = await Course.findOne({ _id: courseId, teacher: req.teacher._id });
        if (!course) {
            return res.status(404).json({ error: 'Course not found or unauthorized' });
        }

        const markRecord = await Marks.findOneAndUpdate(
            { student: studentId, course: courseId, type },
            {
                student: studentId,
                course: courseId,
                teacher: req.teacher._id,
                type,
                marks,
                totalMarks,
                examDate
            },
            { upsert: true, new: true }
        ).populate('student', 'name rollNo');

        res.json(markRecord);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Marks for a Course
exports.getMarks = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Verify the course belongs to the teacher
        const course = await Course.findOne({ _id: courseId, teacher: req.teacher._id });
        if (!course) {
            return res.status(404).json({ error: 'Course not found or unauthorized' });
        }

        const marks = await Marks.find({ course: courseId })
            .populate('student', 'name rollNo email')
            .sort({ type: 1, 'student.rollNo': 1 });

        res.json(marks);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Upload Assignment
exports.uploadAssignment = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { title, description, courseId, dueDate } = req.body;

        if (!title || !description || !courseId || !dueDate) {
            return res.status(400).json({ error: 'Title, description, course, and due date are required' });
        }

        // Verify the course belongs to the teacher
        const course = await Course.findOne({ _id: courseId, teacher: req.teacher._id });
        if (!course) {
            return res.status(404).json({ error: 'Course not found or unauthorized' });
        }

        const assignment = new Assignment({
            title,
            description,
            course: courseId,
            teacher: req.teacher._id,
            filePath: req.file.path,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            dueDate
        });

        await assignment.save();
        res.status(201).json(assignment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Assignments for a Course
exports.getAssignments = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Verify the course belongs to the teacher
        const course = await Course.findOne({ _id: courseId, teacher: req.teacher._id });
        if (!course) {
            return res.status(404).json({ error: 'Course not found or unauthorized' });
        }

        const assignments = await Assignment.find({ course: courseId })
            .sort({ uploadDate: -1 });

        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Request Profile Update
exports.requestProfileUpdate = async (req, res) => {
    try {
        const { name, email, education, department } = req.body;

        if (!name && !email && !education && !department) {
            return res.status(400).json({ error: 'At least one field must be provided for update' });
        }

        // Get current teacher data
        const currentTeacher = await Teacher.findById(req.teacher._id);

        const requestedChanges = {};
        if (name) requestedChanges.name = name;
        if (email) requestedChanges.email = email;
        if (education) requestedChanges.education = education;
        if (department) requestedChanges.department = department;

        const updateRequest = new TeacherUpdateRequest({
            teacher: req.teacher._id,
            requestedChanges,
            currentData: {
                name: currentTeacher.name,
                email: currentTeacher.email,
                education: currentTeacher.education,
                department: currentTeacher.department
            }
        });

        await updateRequest.save();
        res.status(201).json({ 
            message: 'Profile update request submitted successfully. Awaiting admin approval.',
            requestId: updateRequest._id
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Profile Update Requests
exports.getProfileUpdateRequests = async (req, res) => {
    try {
        const requests = await TeacherUpdateRequest.find({ teacher: req.teacher._id })
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get Teacher Profile
exports.getProfile = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.teacher._id).select('-password');
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}; 