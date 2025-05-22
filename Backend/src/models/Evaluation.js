const mongoose = require('mongoose');

const evaluationBaseSchema = {
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    assignments: {
        score: { type: Number, required: true },
        total: { type: Number, required: true },
        percentage: { type: Number, required: true }
    },
    quizzes: {
        score: { type: Number, required: true },
        total: { type: Number, required: true },
        percentage: { type: Number, required: true }
    },
    attendance: {
        score: { type: Number, required: true },
        total: { type: Number, required: true },
        percentage: { type: Number, required: true }
    },
    totalScore: {
        score: { type: Number, required: true },
        total: { type: Number, required: true },
        percentage: { type: Number, required: true }
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        block: { type: String, required: true },
        room: { type: String, required: true }
    }
};

const sessionalSchema = new mongoose.Schema({
    ...evaluationBaseSchema,
    type: {
        type: String,
        default: 'Sessional'
    }
});

const midtermSchema = new mongoose.Schema({
    ...evaluationBaseSchema,
    type: {
        type: String,
        default: 'Midterm'
    }
});

const finalSchema = new mongoose.Schema({
    ...evaluationBaseSchema,
    type: {
        type: String,
        default: 'Final'
    },
    examHall: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    }
});

const Sessional = mongoose.model('Sessional', sessionalSchema);
const Midterm = mongoose.model('Midterm', midtermSchema);
const Final = mongoose.model('Final', finalSchema);

module.exports = {
    Sessional,
    Midterm,
    Final
}; 