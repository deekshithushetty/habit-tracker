const Habit = require('../models/Habit');
const Completion = require('../models/Completion');

// ==========================================
// GET /api/habits
// Fetch all habits for the logged-in user
// Query params: ?archived=true to include archived
// ==========================================
const getHabits = async (req, res, next) => {
  try {
    const { archived } = req.query;

    const filter = { userId: req.user._id };

    // By default only show active habits
    if (archived === 'true') {
      filter.isArchived = true;
    } else if (archived === 'all') {
      // show everything — no isArchived filter
    } else {
      filter.isArchived = false;
    }

    const habits = await Habit.find(filter)
      .sort({ category: 1, sortOrder: 1, createdAt: 1 })
      .lean();

    res.json({ habits });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET /api/habits/:id
// Fetch a single habit by ID
// ==========================================
const getHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).lean();

    if (!habit) {
      return res.status(404).json({
        error: { message: 'Habit not found' }
      });
    }

    res.json({ habit });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// POST /api/habits
// Create a new habit
// ==========================================
const createHabit = async (req, res, next) => {
  try {
    // Get the highest sortOrder for this user to place new habit at end
    const lastHabit = await Habit.findOne({ userId: req.user._id })
      .sort({ sortOrder: -1 })
      .select('sortOrder')
      .lean();

    const nextSortOrder = lastHabit ? lastHabit.sortOrder + 1 : 0;

    const habit = await Habit.create({
      ...req.body,
      userId: req.user._id,
      sortOrder: nextSortOrder
    });

    res.status(201).json({ habit });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// PUT /api/habits/:id
// Update an existing habit
// ==========================================
const updateHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!habit) {
      return res.status(404).json({
        error: { message: 'Habit not found' }
      });
    }

    // Only update fields that were sent
    const allowedFields = ['name', 'emoji', 'color', 'category', 'frequency', 'reminderTime', 'startDate'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        habit[field] = req.body[field];
      }
    });

    await habit.save();

    res.json({ habit });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// PATCH /api/habits/:id/archive
// Archive or unarchive a habit
// ==========================================
const archiveHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!habit) {
      return res.status(404).json({
        error: { message: 'Habit not found' }
      });
    }

    // Toggle archive state
    habit.isArchived = !habit.isArchived;
    habit.archivedAt = habit.isArchived ? new Date() : null;

    // Reset streak when archiving
    if (habit.isArchived) {
      habit.currentStreak = 0;
    }

    await habit.save();

    res.json({
      habit,
      message: habit.isArchived ? 'Habit archived' : 'Habit restored'
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// DELETE /api/habits/:id
// Permanently delete a habit and all its completions
// ==========================================
const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!habit) {
      return res.status(404).json({
        error: { message: 'Habit not found' }
      });
    }

    // Delete all completions for this habit
    const deletedCompletions = await Completion.deleteMany({
      habitId: habit._id
    });

    // Delete the habit itself
    await Habit.deleteOne({ _id: habit._id });

    res.json({
      message: 'Habit and all its history deleted permanently',
      deletedCompletions: deletedCompletions.deletedCount
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// PATCH /api/habits/reorder
// Update sort order for multiple habits at once
// ==========================================
const reorderHabits = async (req, res, next) => {
  try {
    const { habits } = req.body;

    // Build bulk update operations
    const bulkOps = habits.map(({ _id, sortOrder }) => ({
      updateOne: {
        filter: { _id, userId: req.user._id },
        update: { $set: { sortOrder } }
      }
    }));

    const result = await Habit.bulkWrite(bulkOps);

    res.json({
      message: 'Habits reordered successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  archiveHabit,
  deleteHabit,
  reorderHabits
};