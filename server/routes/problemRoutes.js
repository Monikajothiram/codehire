const express = require('express');
const router = express.Router();
const { getAllProblems, getProblemById, createProblem } = require('../controllers/problemController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', getAllProblems);
router.get('/:id', getProblemById);
router.post('/', verifyToken, createProblem);

module.exports = router;