const Student = require("../models/Student");
const Course = require("../models/Course");
const Marks = require("../models/Marks");
const Attendance = require("../models/Attendance");
const Assignment = require("../models/Assignment");
const Lecture = require("../models/Lecture");
const StudentUpdateRequest = require("../models/StudentUpdateRequest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Student Login
exports.login = async (req, res) => {
  console.log("Login request received");
  try {
    const { batch, department, rollNo, password } = req.body;

    // Validate required fields
    if (!batch || !department || !rollNo || !password) {
      return res.status(400).json({
        error:
          "Batch, department, registration number, and password are required",
      });
    }

    // Find student by batch, department and rollNo
    const student = await Student.findOne({
      batch,
      department,
      rollNo,
    });

    if (!student || !(await student.comparePassword(password))) {
      return res.status(401).json({
        error:
          "Invalid credentials. Please check your registration details and password.",
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

// Get Dashboard Info
exports.getDashboardInfo = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).populate(
      "enrolledCourses.course"
    );

    // Calculate overall attendance rate
    const attendanceRates = await Promise.all(
      student.enrolledCourses.map(async (enrollment) => {
        const rate = await student.getAttendanceRate(enrollment.course._id);
        return rate;
      })
    );

    const averageAttendance =
      attendanceRates.length > 0
        ? parseFloat(
            (
              attendanceRates.reduce((a, b) => a + b, 0) /
              attendanceRates.length
            ).toFixed(2)
          )
        : 0.0;

    const totalCredits = student.enrolledCourses.reduce((sum, enrollment) => {
      return sum + enrollment.course.creditHours;
    }, 0);





    res.json({
      name: student.name,
      rollNo: student.rollNo,
      semester: student.semester,
      cgpa: student.cgpa,
      enrolledCourses: student.enrolledCourses,
      attendanceRate: averageAttendance,
      totalCredits: totalCredits,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get GPA Progress
exports.getGpaProgress = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select(
      "semesterResults"
    );

    const gpaData = student.semesterResults
      .sort((a, b) => a.semester - b.semester)
      .map((result) => ({
        semester: result.semester,
        gpa: result.gpa,
      }));

    res.json(gpaData);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get Course Marks
exports.getCourseMarks = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Verify student is enrolled in the course
    const student = await Student.findById(req.student._id);
    const isEnrolled = student.enrolledCourses.some(
      (enrollment) => enrollment.course.toString() === courseId
    );

    if (!isEnrolled) {
      return res.status(403).json({ error: "Not enrolled in this course" });
    }

    const marks = await Marks.find({
      student: req.student._id,
      course: courseId,
    }).populate("course", "courseName courseCode");

    const formattedMarks = marks.map((mark) => ({
      type: mark.type,
      marks: mark.marks,
      totalMarks: mark.totalMarks,
      courseCode: mark.course.courseCode,
      courseName: mark.course.courseName,
    }));

    res.json(formattedMarks);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get Course Attendance Summary
exports.getCourseAttendanceSummary = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Verify student is enrolled in the course
    const student = await Student.findById(req.student._id);
    const isEnrolled = student.enrolledCourses.some(
      (enrollment) => enrollment.course.toString() === courseId
    );

    if (!isEnrolled) {
      return res.status(403).json({ error: "Not enrolled in this course" });
    }

    const attendanceRate = await student.getAttendanceRate(courseId);
    const totalLectures = await Attendance.countDocuments({ course: courseId });
    const presentLectures = await Attendance.countDocuments({
      course: courseId,
      student: req.student._id,
      status: "present",
    });

    res.json({
      totalLectures,
      presentLectures,
      absentLectures: totalLectures - presentLectures,
      attendanceRate,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get Detailed Course Attendance
exports.getDetailedCourseAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Step 1: Verify student is enrolled
    const student = await Student.findById(req.student._id);
    const isEnrolled = student.enrolledCourses.some(
      (enrollment) => enrollment.course.toString() === courseId
    );

    if (!isEnrolled) {
      return res.status(403).json({ error: "Not enrolled in this course" });
    }

    // Step 2: Get all lectures of the course
    const lectures = await Lecture.find({ course: courseId }).sort({ date: 1 });

    // Step 3: Get student's attendance records for this course
    const attendanceRecords = await Attendance.find({
      course: courseId,
      student: req.student._id,
    }).populate("lecture", "title date");

    // Step 4: Create a map of attended lecture IDs
    const attendedLectureIds = new Set(
      attendanceRecords.map((record) => record.lecture._id.toString())
    );

    // Step 5: Build final attendance status list
    const detailedAttendance = lectures.map((lecture) => ({
      lectureId: lecture._id,
      title: lecture.title,
      date: lecture.date,
      status: attendedLectureIds.has(lecture._id.toString())
        ? "Present"
        : "Absent",
    }));

    res.json(detailedAttendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get Available Courses
exports.getAvailableCourses = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);
    const enrolledCourseIds = student.enrolledCourses.map((enrollment) =>
      enrollment.course.toString()
    );

    const availableCourses = await Course.find({
      _id: { $nin: enrolledCourseIds },
      department: student.department,
    });

    res.json(availableCourses);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Register for Courses
exports.registerCourses = async (req, res) => {
  try {
    const { courseIds } = req.body;

    if (!courseIds || !Array.isArray(courseIds)) {
      return res.status(400).json({ error: "Course IDs are required" });
    }

    const student = await Student.findById(req.student._id);
    const courses = await Course.find({ _id: { $in: courseIds } });

    // Verify all courses exist
    if (courses.length !== courseIds.length) {
      return res.status(400).json({ error: "One or more courses not found" });
    }

    // Track newly added course references
    const newEnrollments = [];

    for (const course of courses) {
      // Prevent duplicate enrollment
      const alreadyEnrolled = student.enrolledCourses.some(
        (enrollment) => enrollment.course.toString() === course._id.toString()
      );

      if (!alreadyEnrolled) {
        // Add to student's enrolledCourses
        newEnrollments.push({
          course: course._id,
          semester: student.semester,
        });

        // Add student to course.students if not already added
        if (!course.students.includes(student._id)) {
          course.students.push(student._id);
        }
      }
    }

    if (newEnrollments.length > 0) {
      student.enrolledCourses.push(...newEnrollments);
      await student.save(); // Save updated student
      await Promise.all(courses.map((course) => course.save())); // Save updated courses
    }

    res.json({ message: "Courses registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Semester Result
exports.getSemesterResult = async (req, res) => {
  try {
    const { semester } = req.params;

    const student = await Student.findById(req.student._id);
    const semesterResult = student.semesterResults.find(
      (result) => result.semester.toString() === semester
    );

    if (!semesterResult) {
      return res
        .status(404)
        .json({ error: "Result not found for this semester" });
    }

    // Get course-wise marks for the semester
    const courseMarks = await Marks.find({
      student: req.student._id,
      course: {
        $in: student.enrolledCourses
          .filter((e) => e.semester.toString() === semester)
          .map((e) => e.course),
      },
    }).populate("course", "courseName courseCode creditHours");

    res.json({
      semesterResult,
      courseMarks,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get Fee History
exports.getFeeHistory = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select(
      "feeHistory"
    );
    res.json(student.feeHistory);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get Current Fee Challan
exports.getCurrentFeeChallan = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);
    const currentFeeChallan = student.feeHistory.find(
      (fee) => fee.status === "pending"
    );

    if (!currentFeeChallan) {
      return res.status(404).json({ error: "No pending fee challan found" });
    }

    res.json(currentFeeChallan);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get Assignments
exports.getAssignments = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);
    const enrolledCourseIds = student.enrolledCourses.map((e) => e.course);

    const assignments = await Assignment.find({
      course: { $in: enrolledCourseIds },
    })
      .populate("course", "courseName courseCode")
      .sort({ dueDate: 1 });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get Profile Info
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select("-password");
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Request Profile Update
exports.requestProfileUpdate = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name && !email && !phone && !address) {
      return res
        .status(400)
        .json({ error: "At least one field must be provided for update" });
    }

    // Get current student data
    const currentStudent = await Student.findById(req.student._id);

    const requestedChanges = {};
    if (name) requestedChanges.name = name;
    if (email) requestedChanges.email = email;
    if (phone) requestedChanges.phone = phone;
    if (address) requestedChanges.address = address;

    const updateRequest = new StudentUpdateRequest({
      student: req.student._id,
      requestedChanges,
      currentData: {
        name: currentStudent.name,
        email: currentStudent.email,
        phone: currentStudent.phone,
        address: currentStudent.address,
      },
    });

    await updateRequest.save();
    res.status(201).json({
      message:
        "Profile update request submitted successfully. Awaiting admin approval.",
      requestId: updateRequest._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res
        .status(400)
        .json({ error: "All password fields are required" });
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
