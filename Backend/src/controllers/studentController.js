const Student = require("../models/Student");
const Course = require("../models/Course");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ---------------------------
// Student Login
// ---------------------------
exports.login = async (req, res) => {
  try {
    const { batch, department, rollNo, password } = req.body;

    if (!batch || !department || !rollNo || !password) {
      return res.status(400).json({
        error: "Batch, department, roll number, and password are required",
      });
    }

    const student = await Student.findOne({ batch, department, rollNo });

    if (!student || !(await student.comparePassword(password))) {
      return res.status(401).json({
        error: "Invalid credentials. Please check your details and password.",
      });
    }

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      token,
      message: "Login successful",
      student: {
        id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        batch: student.batch,
        semester: student.semester,
        department: student.department,
        email: student.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------------------
// Get Dashboard Info
// ---------------------------
exports.getDashboardInfo = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id)
      .populate("enrolledCourses.course");

    const totalCredits = student.enrolledCourses.reduce(
      (sum, enrollment) => sum + enrollment.course.creditHours,
      0
    );

    res.json({
      name: student.name,
      rollNo: student.rollNo,
      semester: student.semester,
      cgpa: student.cgpa,
      enrolledCourses: student.enrolledCourses,
      totalCredits,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// ---------------------------
// Get GPA/CGPA Progress
// ---------------------------
exports.getGpaProgress = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select("semesterResults");

    const gpaData = student.semesterResults
      .sort((a, b) => a.semester - b.semester)
      .map((result) => ({ semester: result.semester, gpa: result.gpa }));

    res.json(gpaData);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------------------
// Get Available Courses
// ---------------------------
exports.getAvailableCourses = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);

    const availableCourses = await Course.find({
      department: student.department,
    });

    res.json(availableCourses);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------------------
// Register for Courses
// ---------------------------
exports.registerCourses = async (req, res) => {
  try {
    const { courseIds } = req.body;

    if (!courseIds || !Array.isArray(courseIds)) {
      return res.status(400).json({ error: "Course IDs are required" });
    }

    const student = await Student.findById(req.student._id);
    const courses = await Course.find({ _id: { $in: courseIds } });

    if (courses.length !== courseIds.length) {
      return res.status(400).json({ error: "One or more courses not found" });
    }

    const newEnrollments = [];

    for (const course of courses) {
      const alreadyEnrolled = student.enrolledCourses.some(
        (enrollment) => enrollment.course.toString() === course._id.toString()
      );

      if (!alreadyEnrolled) {
        newEnrollments.push({ course: course._id, semester: student.semester });
        if (!course.students.includes(student._id)) {
          course.students.push(student._id);
        }
      }
    }

    if (newEnrollments.length > 0) {
      student.enrolledCourses.push(...newEnrollments);
      await student.save();
      await Promise.all(courses.map((course) => course.save()));
    }

    res.json({ message: "Courses registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ---------------------------
// Get Student Profile
// ---------------------------
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select("-password");
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------------------
// Update Profile
// ---------------------------
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const student = await Student.findById(req.student._id);

    if (!student) return res.status(404).json({ error: "Student not found" });

    if (name) student.name = name;
    if (email) student.email = email;
    if (phone) student.phone = phone;
    if (address) student.address = address;

    await student.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ---------------------------
// Change Password
// ---------------------------
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ error: "All password fields are required" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: "New passwords do not match" });
    }

    const student = await Student.findById(req.student._id);

    if (!(await student.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    student.password = newPassword;
    await student.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};