// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Admin only.' });
    }
};

// Middleware to check if user is tutor
exports.isTutor = (req, res, next) => {
    if (req.user && req.user.role === 'tutor') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Tutor only.' });
    }
};

// Middleware to check if user is student
exports.isStudent = (req, res, next) => {
    if (req.user && req.user.role === 'student') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Student only.' });
    }
};

// Middleware to check if user is either admin or tutor
exports.isAdminOrTutor = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'tutor')) {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Admin or Tutor only.' });
    }
};

// Middleware to check if user is either the owner of the resource or an admin
exports.isOwnerOrAdmin = (resourceUserId) => (req, res, next) => {
    if (req.user && (req.user.id === resourceUserId || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Not authorized.' });
    }
}; 