const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    education: { type: String, required: true, trim: true },
    department: { 
        type: String, 
        required: true, 
        enum: ["BSSE", "BSCS", "BBA", "BCE"] 
    },
    password: { type: String, required: true }
}, { timestamps: true });

// Hash password before saving
teacherSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Compare password
teacherSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Teacher', teacherSchema);