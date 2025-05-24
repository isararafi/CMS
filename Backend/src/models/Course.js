const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        trim: true
    },
    courseCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    creditHours: {
        type: Number,
        required: true
    },
    semester: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]
}, {
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course; 