const express = require('express');
const router = express.Router();
const { register, login, getProfile, getAllUsers } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);
router.get('/users', verifyToken, getAllUsers);

module.exports = router;