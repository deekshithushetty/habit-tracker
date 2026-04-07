const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createHabitSchema,
  updateHabitSchema,
  reorderSchema
} = require('../validators/habit.validator');
const {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  archiveHabit,
  deleteHabit,
  reorderHabits
} = require('../controllers/habit.controller');

// All habit routes require authentication
router.use(protect);

// Reorder must be before /:id to avoid route conflict
router.patch('/reorder', validate(reorderSchema), reorderHabits);

router.get('/', getHabits);
router.get('/:id', getHabit);
router.post('/', validate(createHabitSchema), createHabit);
router.put('/:id', validate(updateHabitSchema), updateHabit);
router.patch('/:id/archive', archiveHabit);
router.delete('/:id', deleteHabit);

module.exports = router;