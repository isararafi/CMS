const mongoose = require('mongoose');

const studentUpdateRequestSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
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
        phone: {
            type: String,
            trim: true
        },
        address: {
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
        phone: {
            type: String
        },
        address: {
            type: String
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

const StudentUpdateRequest = mongoose.model('StudentUpdateRequest', studentUpdateRequestSchema);
module.exports = StudentUpdateRequest; 