const Completion = require('../models/Completion');
const Habit = require('../models/Habit');
const { calculateStreak } = require('../utils/streaks');
const { getTodayStr, subtractDays } = require('../utils/dateHelpers');

// ==========================================
// POST /api/completions/toggle
// Toggle a habit completion for a specific date
// Body: { habitId, date }
// ==========================================
const toggleCompletion = async (req, res, next) => {
  try {
    const { habitId, date } = req.body;

    // Verify the habit exists and belongs to this user
    const habit = await Habit.findOne({
      _id: habitId,
      userId: req.user._id
    });

    if (!habit) {
      return res.status(404).json({
        error: { message: 'Habit not found' }
      });
    }

    // Don't allow completing archived habits
    if (habit.isArchived) {
      return res.status(400).json({
        error: { message: 'Cannot complete an archived habit' }
      });
    }

    // Don't allow future dates
    const today = getTodayStr();
    if (date > today) {
      return res.status(400).json({
        error: { message: 'Cannot complete habits for future dates' }
      });
    }

    // Don't allow dates more than 7 days in the past
    const weekAgo = subtractDays(today, 7);
    if (date < weekAgo) {
      return res.status(400).json({
        error: { message: 'Cannot modify completions older than 7 days' }
      });
    }

    // Toggle the completion
    const result = await Completion.toggle(req.user._id, habitId, date);

    // Recalculate streak
    const streakData = await recalculateStreak(habit);

    res.json({
      action: result.action,
      completion: result.completion,
      streak: {
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        totalCompletions: streakData.totalCompletions
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET /api/completions?date=YYYY-MM-DD
// Get all completions for a specific date
// ==========================================
const getCompletionsByDate = async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        error: { message: 'Date query parameter is required (YYYY-MM-DD)' }
      });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        error: { message: 'Date must be in YYYY-MM-DD format' }
      });
    }

    const completions = await Completion.getByDate(req.user._id, date);

    // Return as a map of habitId → completion for easy frontend lookup
    const completionMap = {};
    completions.forEach(c => {
      completionMap[c.habitId.toString()] = {
        _id: c._id,
        date: c.date,
        completed: c.completed,
        createdAt: c.createdAt
      };
    });

    res.json({
      date,
      completions: completionMap,
      totalCompleted: completions.length
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET /api/completions/history/:habitId?from=...&to=...
// Get completion history for a specific habit
// ==========================================
const getHabitHistory = async (req, res, next) => {
  try {
    const { habitId } = req.params;
    const { from, to } = req.query;

    // Verify habit belongs to user
    const habit = await Habit.findOne({
      _id: habitId,
      userId: req.user._id
    });

    if (!habit) {
      return res.status(404).json({
        error: { message: 'Habit not found' }
      });
    }

    // Default range: last 30 days
    const today = getTodayStr();
    const startDate = from || subtractDays(today, 30);
    const endDate = to || today;

    // Validate date formats
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return res.status(400).json({
        error: { message: 'Dates must be in YYYY-MM-DD format' }
      });
    }

    const completions = await Completion.getHabitHistory(habitId, startDate, endDate);

    // Build a Set of completed dates
    const completedDates = completions.map(c => c.date);

    res.json({
      habitId,
      from: startDate,
      to: endDate,
      completedDates,
      totalCompleted: completions.length
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET /api/completions/range?from=...&to=...
// Get all completions for the user within a date range
// ==========================================
const getCompletionRange = async (req, res, next) => {
  try {
    const { from, to } = req.query;

    const today = getTodayStr();
    const startDate = from || subtractDays(today, 7);
    const endDate = to || today;

    // Validate date formats
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return res.status(400).json({
        error: { message: 'Dates must be in YYYY-MM-DD format' }
      });
    }

    const completions = await Completion.getUserHistory(
      req.user._id,
      startDate,
      endDate
    );

    // Group by date
    const byDate = {};
    completions.forEach(c => {
      if (!byDate[c.date]) {
        byDate[c.date] = [];
      }
      byDate[c.date].push(c.habitId.toString());
    });

    res.json({
      from: startDate,
      to: endDate,
      completionsByDate: byDate,
      totalCompletions: completions.length
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Helper: Recalculate streak for a habit
// Called after every toggle
// ==========================================
const recalculateStreak = async (habit) => {
  const today = getTodayStr();

  // Get completions for the last year (more than enough for streak calc)
  const yearAgo = subtractDays(today, 365);
  const completions = await Completion.find({
    habitId: habit._id,
    date: { $gte: yearAgo, $lte: today }
  })
    .sort({ date: -1 })
    .lean();

  // Calculate current streak
  const currentStreak = calculateStreak(habit, completions, today);

  // Get total completions count
  const totalCompletions = await Completion.countDocuments({
    habitId: habit._id
  });

  // Update longest streak if current exceeds it
  const longestStreak = Math.max(currentStreak, habit.longestStreak);

  // Save to habit document
  habit.currentStreak = currentStreak;
  habit.longestStreak = longestStreak;
  habit.totalCompletions = totalCompletions;
  await habit.save();

  return {
    currentStreak,
    longestStreak,
    totalCompletions
  };
};

module.exports = {
  toggleCompletion,
  getCompletionsByDate,
  getHabitHistory,
  getCompletionRange
};