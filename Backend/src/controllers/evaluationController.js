const { Sessional, Midterm, Final } = require('../models/Evaluation');

// Helper function to get the correct model
const getModel = (type) => {
    switch (type.toLowerCase()) {
        case 'sessional': return Sessional;
        case 'midterm': return Midterm;
        case 'final': return Final;
        default: throw new Error('Invalid evaluation type');
    }
};

// Create evaluation
const createEvaluation = async (req, res) => {
    try {
        const Model = getModel(req.params.type);
        const evaluation = new Model(req.body);
        const savedEvaluation = await evaluation.save();
        res.status(201).json(savedEvaluation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all evaluations of a specific type
const getAllEvaluations = async (req, res) => {
    try {
        const Model = getModel(req.params.type);
        const evaluations = await Model.find()
            .populate('course')
            .populate('studentId');
        res.json(evaluations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get evaluation by ID
const getEvaluationById = async (req, res) => {
    try {
        const Model = getModel(req.params.type);
        const evaluation = await Model.findById(req.params.id)
            .populate('course')
            .populate('studentId');
        if (!evaluation) {
            return res.status(404).json({ message: 'Evaluation not found' });
        }
        res.json(evaluation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update evaluation
const updateEvaluation = async (req, res) => {
    try {
        const Model = getModel(req.params.type);
        const updatedEvaluation = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedEvaluation) {
            return res.status(404).json({ message: 'Evaluation not found' });
        }
        res.json(updatedEvaluation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete evaluation
const deleteEvaluation = async (req, res) => {
    try {
        const Model = getModel(req.params.type);
        const deletedEvaluation = await Model.findByIdAndDelete(req.params.id);
        if (!deletedEvaluation) {
            return res.status(404).json({ message: 'Evaluation not found' });
        }
        res.json({ message: 'Evaluation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get student evaluations
const getStudentEvaluations = async (req, res) => {
    try {
        const { studentId } = req.params;
        const Model = getModel(req.params.type);
        const evaluations = await Model.find({ studentId })
            .populate('course')
            .populate('studentId');
        res.json(evaluations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEvaluation,
    getAllEvaluations,
    getEvaluationById,
    updateEvaluation,
    deleteEvaluation,
    getStudentEvaluations
}; 