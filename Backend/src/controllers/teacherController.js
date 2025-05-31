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
        const { title, date, courseId } = req.body;

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
            teacher: req.teacher._id
            
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

// Add Marks
exports.addMarks = async (req, res) => {
    try {
        const { studentId, courseId, type, marks, totalMarks } = req.body;

        // Validate required fields
        if (!studentId || !courseId || !type || marks === undefined || !totalMarks ) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Verify the course belongs to the teacher
        const course = await Course.findOne({ _id: courseId, teacher: req.teacher._id });
        if (!course) {
            return res.status(404).json({ error: 'Course not found or unauthorized' });
        }

        // Check if marks already exist
        const existingMarks = await Marks.findOne({ 
            student: studentId, 
            course: courseId, 
            type 
        });

        if (existingMarks) {
            return res.status(400).json({ 
                error: 'Marks already exist for this student in this course and exam type. Use update marks API instead.' 
            });
        }

        // Create new marks record
        const markRecord = new Marks({
            student: studentId,
            course: courseId,
            teacher: req.teacher._id,
            type,
            marks,
            totalMarks
        });

        await markRecord.save();

        const populatedRecord = await Marks.findById(markRecord._id)
            .populate('student', 'name rollNo')
            .populate('course', 'courseName courseCode');

        res.status(201).json({
            message: 'Marks added successfully',
            markRecord: populatedRecord
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update Marks
exports.updateMarks = async (req, res) => {
    try {
        const { studentId, courseId, type, marks, totalMarks, examDate } = req.body;

        // Validate required fields
        if (!studentId || !courseId || !type || marks === undefined || !totalMarks || !examDate) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Verify the course belongs to the teacher
        const course = await Course.findOne({ _id: courseId, teacher: req.teacher._id });
        if (!course) {
            return res.status(404).json({ error: 'Course not found or unauthorized' });
        }

        // Find existing marks
        const existingMarks = await Marks.findOne({ 
            student: studentId, 
            course: courseId, 
            type 
        });

        if (!existingMarks) {
            return res.status(404).json({ 
                error: 'No marks found for this student in this course and exam type. Use add marks API instead.' 
            });
        }

        // Update marks
        const updatedMarks = await Marks.findByIdAndUpdate(
            existingMarks._id,
            {
                marks,
                totalMarks,
                examDate,
                updatedAt: Date.now()
            },
            { new: true }
        )
        .populate('student', 'name rollNo')
        .populate('course', 'courseName courseCode');

        res.json({
            message: 'Marks updated successfully',
            markRecord: updatedMarks
        });
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

        const {courseId} = req.body;

        if (!courseId) {
            return res.status(400).json({ error: 'course is required' });
        }

        // Verify the course belongs to the teacher
        const course = await Course.findOne({ _id: courseId, teacher: req.teacher._id });
        if (!course) {
            return res.status(404).json({ error: 'Course not found or unauthorized' });
        }

        // Create file URL
        const fileUrl = `/api/assignments/download/${req.file.filename}`;

        const assignment = new Assignment({
            course: courseId,
            teacher: req.teacher._id,
            filePath: req.file.path,
            fileName: req.file.originalname,
            fileUrl: fileUrl,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
        });

        await assignment.save();

        // Return assignment with download URL
        res.status(201).json({
            ...assignment.toObject(),
            downloadUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
        });
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

        // Add download URLs to each assignment
        const assignmentsWithUrls = assignments.map(assignment => ({
            ...assignment.toObject(),
            downloadUrl: `${req.protocol}://${req.get('host')}${assignment.fileUrl}`
        }));

        res.json(assignmentsWithUrls);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Download Assignment
exports.downloadAssignment = async (req, res) => {
    try {
        const { filename } = req.params;
        const assignment = await Assignment.findOne({ filePath: `uploads/assignments/${filename}` });

        if (!assignment) {
            return res.status(404).json({ error: 'Assignment file not found' });
        }

        // Send file for download
        res.download(assignment.filePath, assignment.fileName);
    } catch (error) {
        res.status(500).json({ error: 'Error downloading file' });
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

// Get All Students for Teacher's Courses
exports.getStudentsForTeacherCourses = async (req, res) => {
    try {
        // Find all courses taught by the teacher
        const courses = await Course.find({ teacher: req.teacher._id });

        // Extract student IDs from these courses
        const studentIds = courses.reduce((acc, course) => {
            return acc.concat(course.students);
        }, []);

        // Remove duplicate student IDs
        const uniqueStudentIds = [...new Set(studentIds.map(id => id.toString()))];

        // Fetch student details
        const students = await Student.find({ _id: { $in: uniqueStudentIds } })
            .select('name rollNo email department');

        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}; 