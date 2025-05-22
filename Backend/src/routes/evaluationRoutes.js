const express = require('express');
const router = express.Router();
const {
    createEvaluation,
    getAllEvaluations,
    getEvaluationById,
    updateEvaluation,
    deleteEvaluation,
    getStudentEvaluations
} = require('../controllers/evaluationController');

// Routes for each evaluation type (sessional, midterm, final)
// Create new evaluation
router.post('/:type', createEvaluation);

// Get all evaluations of a specific type
router.get('/:type', getAllEvaluations);

// Get specific evaluation by ID
router.get('/:type/:id', getEvaluationById);

// Update specific evaluation
router.put('/:type/:id', updateEvaluation);

// Delete specific evaluation
router.delete('/:type/:id', deleteEvaluation);

// Get student's evaluations
router.get('/:type/student/:studentId', getStudentEvaluations);

module.exports = router; 