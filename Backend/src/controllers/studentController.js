const Student = require('../models/Student');

// Get student information by roll number
const getStudentByRollNo = async (req, res) => {
    try {
        const student = await Student.findOne({ rollNo: req.params.rollNo });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new student
const createStudent = async (req, res) => {
    const student = new Student({
        name: req.body.name,
        rollNo: req.body.rollNo,
        semester: req.body.semester,
        department: req.body.department,
        currentGPA: req.body.currentGPA,
        coursesEnrolled: req.body.coursesEnrolled,
        attendanceRate: req.body.attendanceRate,
        totalCredits: req.body.totalCredits
    });

    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getStudentByRollNo,
    createStudent
};