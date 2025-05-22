const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true,
    unique: true
  },
  semester: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  currentGPA: {
    type: Number,
    required: true
  },
  coursesEnrolled: {
    type: Number,
    required: true
  },
  attendanceRate: {
    type: Number,
    required: true
  },
  totalCredits: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Student', studentSchema); 