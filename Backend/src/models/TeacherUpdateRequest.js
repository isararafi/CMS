const mongoose = require('mongoose');

const teacherUpdateRequestSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    requestedChanges: {
        name: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true
        },
        education: {
            type: String,
            trim: true
        },
        department: {
            type: String,
            trim: true
        }
    },
    currentData: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        education: {
            type: String,
            required: true
        },
        department: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    adminResponse: {
        type: String,
        trim: true
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    reviewedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const TeacherUpdateRequest = mongoose.model('TeacherUpdateRequest', teacherUpdateRequestSchema);
module.exports = TeacherUpdateRequest; 