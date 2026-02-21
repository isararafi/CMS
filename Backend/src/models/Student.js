const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true, trim: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    department: { 
        type: String, 
        required: true, 
        enum: ["BSSE", "BSCS", "BBA", "BCE"] 
    },
    batch: { 
        type: String, 
        required: true, 
        enum: ["FALL-22", "FALL-23", "SPRING-23"] 
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    marks: [{
        course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        marks: { type: Number, min: 0, max: 100 },
        semester: { type: Number, min: 1, max: 8 },
        examType: { type: String, enum: ["Midterm", "Final"] }
    }]
}, { timestamps: true });

// Hash password before saving
studentSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Compare password
studentSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Student', studentSchema);