const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');
const { toggleSchema } = require('../validators/completion.validator');
const {
  toggleCompletion,
  getCompletionsByDate,
  getHabitHistory,
  getCompletionRange
} = require('../controllers/completion.controller');

// All completion routes require authentication
router.use(protect);

// Toggle a completion on/off
router.post('/toggle', validate(toggleSchema), toggleCompletion);

// Get completions for a specific date
router.get('/', getCompletionsByDate);

// Get completions for a date range (all habits)
router.get('/range', getCompletionRange);

// Get completion history for a specific habit
router.get('/history/:habitId', getHabitHistory);

module.exports = router;