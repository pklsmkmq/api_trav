const express = require('express');
const { register, verifyEmail, login } = require('../controllers/authController');

const router = express.Router();
router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);

module.exports = router;
