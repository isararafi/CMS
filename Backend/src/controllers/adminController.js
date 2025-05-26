const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

// Admin Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.json({ token, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get Admin Info
exports.getAdminInfo = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id).select('-password');
        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Dashboard Overview
exports.getDashboardStats = async (req, res) => {
    try {
        const studentsCount = await Student.countDocuments();
        const teachersCount = await Teacher.countDocuments();
        res.json({ studentsCount, teachersCount });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Student Management
exports.addStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().select('-password');
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        let student;
        if (req.params.id) {
            student = await Student.findByIdAndDelete(req.params.id);
        } else {
            const { batch, rollNo, department } = req.body;
            student = await Student.findOneAndDelete({ batch, rollNo, department });
        }

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Teacher Management
exports.addTeacher = async (req, res) => {
    try {
        const teacher = new Teacher(req.body);
        await teacher.save();
        res.status(201).json(teacher);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().select('-password');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        res.json(teacher);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        let teacher;
        if (req.params.id) {
            teacher = await Teacher.findByIdAndDelete(req.params.id);
        } else {
            teacher = await Teacher.findOneAndDelete({ email: req.body.email });
        }

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin Profile Management
exports.updateProfile = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'password'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ error: 'Invalid updates' });
        }

        const admin = await Admin.findById(req.admin._id);
        updates.forEach(update => admin[update] = req.body[update]);
        await admin.save();

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Register a new admin
exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if admin with email already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create new admin
        const admin = new Admin({
            name,
            email,
            password
        });

        await admin.save();

        // Return success response without password
        res.status(201).json({
            message: 'Admin registered successfully',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

// Register a new student
exports.registerStudent = async (req, res) => {
    try {
        const { 
            name, 
            email, 
            password, 
            rollNo, 
            semester, 
            department, 
            batch,
            phone,
            address 
        } = req.body;

        // Validate required fields
        if (!name || !email || !password || !rollNo || !semester || !department || !batch) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        // Validate semester range
        if (semester < 1 || semester > 8) {
            return res.status(400).json({ error: 'Semester must be between 1 and 8' });
        }

        // Check if student with email or rollNo already exists
        const existingStudent = await Student.findOne({ 
            $or: [{ email }, { rollNo }] 
        });
        if (existingStudent) {
            return res.status(400).json({ 
                error: 'Student with this email or roll number already exists' 
            });
        }

        // Create new student
        const student = new Student({
            name,
            email,
            password,
            rollNo,
            semester,
            department,
            batch,
            phone,
            address
        });

        await student.save();

        // Return success response without password
        res.status(201).json({
            message: 'Student registered successfully',
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                rollNo: student.rollNo,
                semester: student.semester,
                department: student.department
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Register a new teacher
exports.registerTeacher = async (req, res) => {
    try {
        const { 
            name, 
            email, 
            password, 
            education, 
            department 
        } = req.body;

        // Validate required fields
        if (!name || !email || !password || !education || !department) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if teacher with email already exists
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create new teacher
        const teacher = new Teacher({
            name,
            email,
            password,
            education,
            department
        });

        await teacher.save();

        // Return success response without password
        res.status(201).json({
            message: 'Teacher registered successfully',
            teacher: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                education: teacher.education,
                department: teacher.department
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Course Management
exports.createCourse = async (req, res) => {
    try {
        const { courseName, courseCode, creditHours, semester, department, teacherId } = req.body;

        // Validate required fields
        if (!courseName || !courseCode || !creditHours || !semester || !department || !teacherId) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if course with courseCode already exists
        const existingCourse = await Course.findOne({ courseCode });
        if (existingCourse) {
            return res.status(400).json({ error: 'Course with this code already exists' });
        }

        // Verify if teacher exists
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        // Create new course
        const course = new Course({
            courseName,
            courseCode,
            creditHours,
            semester,
            department,
            teacher: teacherId
        });

        await course.save();

        res.status(201).json({
            message: 'Course created successfully',
            course
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const updates = req.body;
        const courseId = req.params.id;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // If updating courseCode, check if it already exists
        if (updates.courseCode && updates.courseCode !== course.courseCode) {
            const existingCourse = await Course.findOne({ courseCode: updates.courseCode });
            if (existingCourse) {
                return res.status(400).json({ error: 'Course code already exists' });
            }
        }

        // If updating teacher, verify if new teacher exists
        if (updates.teacherId) {
            const teacher = await Teacher.findById(updates.teacherId);
            if (!teacher) {
                return res.status(404).json({ error: 'Teacher not found' });
            }
            updates.teacher = updates.teacherId;
            delete updates.teacherId;
        }

        // Update course
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('teacher', 'name email');

        res.json({
            message: 'Course updated successfully',
            course: updatedCourse
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;

        // Check if course exists and delete it
        const course = await Course.findByIdAndDelete(courseId);
        
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json({ 
            message: 'Course deleted successfully',
            deletedCourse: course
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('teacher', 'name email')
            .populate('students', 'name rollNo');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}; 