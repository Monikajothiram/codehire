const express = require('express');
const router = express.Router();
const { getAllContests, createContest, getContestById } = require('../controllers/contestController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', getAllContests);
router.get('/:id', getContestById);
router.post('/', verifyToken, createContest);

module.exports = router;