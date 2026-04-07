const express = require('express');
const router = express.Router();
const { register, login, refresh, logout, getMe } = require('../controllers/auth.controller');
const { updatePreferences, changePassword, deleteAccount } = require('../controllers/user.controller');
const validate = require('../middleware/validate');
const protect = require('../middleware/auth');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);
router.put('/preferences', protect, updatePreferences);
router.put('/password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;