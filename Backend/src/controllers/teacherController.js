const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ---------------------------
// Teacher Login
// ---------------------------
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

        const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

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

// ---------------------------
// Get Teacher Profile
// ---------------------------
exports.getProfile = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.teacher._id).select('-password');
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// ---------------------------
// Update Teacher Profile
// ---------------------------
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, education, department } = req.body;
        const teacher = await Teacher.findById(req.teacher._id);

        if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

        if (name) teacher.name = name;
        if (email) teacher.email = email;
        if (education) teacher.education = education;
        if (department) teacher.department = department;

        await teacher.save();
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ---------------------------
// Get Courses Assigned to Teacher
// ---------------------------
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ teacher: req.teacher._id })
            .populate('students', 'name rollNo email');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// ---------------------------
// Get Students for a Specific Course
// ---------------------------
exports.getStudentsForCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Verify course belongs to this teacher
        const course = await Course.findOne({ _id: courseId, teacher: req.teacher._id });
        if (!course) return res.status(404).json({ error: 'Course not found or not authorized' });

        // Fetch students in the course
        const students = await Student.find({ _id: { $in: course.students } })
            .select('name rollNo email department');

        res.json({
            courseId: course._id,
            courseName: course.courseName,
            students
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// ---------------------------
// Add or Update Marks for Students in a Course
// ---------------------------
exports.addOrUpdateMarks = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { marks, examType } = req.body;

    if (!marks || !Array.isArray(marks)) {
      return res.status(400).json({
        error: "Marks must be an array of { studentId, marks }"
      });
    }

    const course = await Course.findOne({
      _id: courseId,
      teacher: req.teacher._id
    });

    if (!course) {
      return res.status(404).json({
        error: "Course not found or not authorized"
      });
    }

    for (const item of marks) {
      const { studentId, marks: score } = item;

      if (score < 0 || score > 100) continue;

      const student = await Student.findById(studentId);
      if (
        !student ||
        !course.students.some(id => id.toString() === student._id.toString())
      ) continue;

      const markIndex = student.marks.findIndex(
        m =>
          m.course.toString() === course._id.toString() &&
          m.examType === examType
      );

      if (markIndex !== -1) {
        student.marks[markIndex].marks = score;
      } else {
        student.marks.push({
          course: course._id,
          marks: score,
          semester: student.semester,
          examType
        });
      }

      await student.save();
    }

    res.json({ message: "Marks added/updated successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};