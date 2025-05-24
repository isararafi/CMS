const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
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
    type: {
        type: String,
        enum: ['sessional', 'midterm', 'final'],
        required: true
    },
    marks: {
        type: Number,
        required: true,
        min: 0
    },
    totalMarks: {
        type: Number,
        required: true,
        min: 1
    },
    examDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

// Create compound index to prevent duplicate marks for same student, course, and type
marksSchema.index({ student: 1, course: 1, type: 1 }, { unique: true });

const Marks = mongoose.model('Marks', marksSchema);
module.exports = Marks; 