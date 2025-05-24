const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    rollNo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    batch: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    enrolledCourses: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        semester: {
            type: Number,
            required: true
        },
        enrollmentDate: {
            type: Date,
            default: Date.now
        }
    }],
    semesterResults: [{
        semester: {
            type: Number,
            required: true
        },
        gpa: {
            type: Number,
            required: true,
            min: 0,
            max: 4
        },
        totalCredits: {
            type: Number,
            required: true,
            min: 0
        },
        completedDate: {
            type: Date,
            required: true
        }
    }],
    cgpa: {
        type: Number,
        default: 0,
        min: 0,
        max: 4
    },
    totalCredits: {
        type: Number,
        default: 0,
        min: 0
    },
    feeHistory: [{
        semester: {
            type: Number,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'overdue'],
            default: 'pending'
        },
        dueDate: {
            type: Date,
            required: true
        },
        paidDate: {
            type: Date
        },
        challanNo: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare password
studentSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate attendance rate for a course
studentSchema.methods.getAttendanceRate = async function(courseId) {
    const Attendance = mongoose.model('Attendance');
    const totalLectures = await Attendance.countDocuments({ course: courseId });
    const presentLectures = await Attendance.countDocuments({ 
        course: courseId,
        student: this._id,
        status: 'present'
    });
    return totalLectures > 0 ? (presentLectures / totalLectures) * 100 : 0;
};

const Student = mongoose.model('Student', studentSchema);
module.exports = Student; 