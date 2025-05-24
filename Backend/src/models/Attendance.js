const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    lecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'absent'],
        required: true
    },
    date: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

// Create compound index to prevent duplicate attendance records
attendanceSchema.index({ student: 1, lecture: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance; 