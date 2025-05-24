const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');

const teacherAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const teacher = await Teacher.findById(decoded.id);

        if (!teacher) {
            throw new Error();
        }

        req.token = token;
        req.teacher = teacher;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate as a teacher.' });
    }
};

module.exports = teacherAuth; 