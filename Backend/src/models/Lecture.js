const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
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
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Lecture = mongoose.model('Lecture', lectureSchema);
module.exports = Lecture; 