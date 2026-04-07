const Habit = require('../models/Habit');
const Completion = require('../models/Completion');
const { getTodayStr, subtractDays, getDateRange, getDayOfWeek } = require('../utils/dateHelpers');

// ==========================================
// GET /api/insights/overview?period=week|month|year
// Overall completion rate and totals
// ==========================================
const getOverview = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query;
    const today = getTodayStr();

    // Calculate date range based on period
    let startDate;
    switch (period) {
      case 'week':
        startDate = subtractDays(today, 7);
        break;
      case 'month':
        startDate = subtractDays(today, 30);
        break;
      case 'year':
        startDate = subtractDays(today, 365);
        break;
      case 'all':
        startDate = '2000-01-01'; // effectively all time
        break;
      default:
        startDate = subtractDays(today, 30);
    }

    // Get all active habits
    const habits = await Habit.find({
      userId: req.user._id,
      isArchived: false
    }).lean();

    if (habits.length === 0) {
      return res.json({
        period,
        totalHabits: 0,
        completionRate: 0,
        totalCompletions: 0,
        totalScheduled: 0,
        daysInPeriod: 0
      });
    }

    const habitIds = habits.map(h => h._id);

    // Get all completions in the period
    const completions = await Completion.find({
      habitId: { $in: habitIds },
      date: { $gte: startDate, $lte: today }
    }).lean();

    // Calculate total scheduled instances
    const dateRange = getDateRange(startDate, today);
    let totalScheduled = 0;

    dateRange.forEach(date => {
      const dayOfWeek = getDayOfWeek(date);
      habits.forEach(habit => {
        if (isHabitScheduledForDay(habit, dayOfWeek)) {
          totalScheduled++;
        }
      });
    });

    const totalCompletions = completions.length;
    const completionRate = totalScheduled > 0
      ? Math.round((totalCompletions / totalScheduled) * 100)
      : 0;

    res.json({
      period,
      totalHabits: habits.length,
      completionRate,
      totalCompletions,
      totalScheduled,
      daysInPeriod: dateRange.length
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET /api/insights/streaks
// All habits ranked by current streak
// ==========================================
const getStreaks = async (req, res, next) => {
  try {
    const habits = await Habit.find({
      userId: req.user._id,
      isArchived: false
    })
      .select('name emoji color category currentStreak longestStreak totalCompletions')
      .sort({ currentStreak: -1, longestStreak: -1 })
      .lean();

    res.json({ streaks: habits });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET /api/insights/daily-trend?period=week|month
// Completion percentage by day
// ==========================================
const getDailyTrend = async (req, res, next) => {
  try {
    const { period = 'week' } = req.query;
    const today = getTodayStr();

    let startDate;
    switch (period) {
      case 'week':
        startDate = subtractDays(today, 6); // last 7 days including today
        break;
      case 'month':
        startDate = subtractDays(today, 29); // last 30 days including today
        break;
      default:
        startDate = subtractDays(today, 6);
    }

    // Get all active habits
    const habits = await Habit.find({
      userId: req.user._id,
      isArchived: false
    }).lean();

    if (habits.length === 0) {
      return res.json({ trend: [] });
    }

    const habitIds = habits.map(h => h._id);

    // Get all completions in the period
    const completions = await Completion.find({
      habitId: { $in: habitIds },
      date: { $gte: startDate, $lte: today }
    }).lean();

    // Group completions by date
    const completionsByDate = {};
    completions.forEach(c => {
      if (!completionsByDate[c.date]) {
        completionsByDate[c.date] = 0;
      }
      completionsByDate[c.date]++;
    });

    // Build daily trend
    const dateRange = getDateRange(startDate, today);
    const trend = dateRange.map(date => {
      const dayOfWeek = getDayOfWeek(date);

      // Count how many habits were scheduled this day
      let scheduledCount = 0;
      habits.forEach(habit => {
        if (isHabitScheduledForDay(habit, dayOfWeek)) {
          scheduledCount++;
        }
      });

      const completedCount = completionsByDate[date] || 0;
      const percentage = scheduledCount > 0
        ? Math.round((completedCount / scheduledCount) * 100)
        : 0;

      return {
        date,
        completed: completedCount,
        scheduled: scheduledCount,
        percentage
      };
    });

    res.json({ trend });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET /api/insights/best-worst-days?period=month
// Completion rate by day of week
// ==========================================
const getBestWorstDays = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query;
    const today = getTodayStr();

    let startDate;
    switch (period) {
      case 'week':
        startDate = subtractDays(today, 7);
        break;
      case 'month':
        startDate = subtractDays(today, 30);
        break;
      case 'year':
        startDate = subtractDays(today, 365);
        break;
      default:
        startDate = subtractDays(today, 30);
    }

    // Get all active habits
    const habits = await Habit.find({
      userId: req.user._id,
      isArchived: false
    }).lean();

    if (habits.length === 0) {
      return res.json({ dayStats: [] });
    }

    const habitIds = habits.map(h => h._id);

    // Get all completions in the period
    const completions = await Completion.find({
      habitId: { $in: habitIds },
      date: { $gte: startDate, $lte: today }
    }).lean();

    // Initialize day stats (0=Sunday through 6=Saturday)
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayStats = dayNames.map((name, index) => ({
      dayOfWeek: index,
      dayName: name,
      completed: 0,
      scheduled: 0,
      percentage: 0
    }));

    // Group completions by day of week
    const completionsByDay = {};
    completions.forEach(c => {
      const day = getDayOfWeek(c.date);
      if (!completionsByDay[day]) {
        completionsByDay[day] = 0;
      }
      completionsByDay[day]++;
    });

    // Count scheduled instances per day of week
    const dateRange = getDateRange(startDate, today);
    const scheduledByDay = {};

    dateRange.forEach(date => {
      const dayOfWeek = getDayOfWeek(date);
      if (!scheduledByDay[dayOfWeek]) {
        scheduledByDay[dayOfWeek] = 0;
      }
      habits.forEach(habit => {
        if (isHabitScheduledForDay(habit, dayOfWeek)) {
          scheduledByDay[dayOfWeek]++;
        }
      });
    });

    // Calculate percentages
    dayStats.forEach(stat => {
      stat.completed = completionsByDay[stat.dayOfWeek] || 0;
      stat.scheduled = scheduledByDay[stat.dayOfWeek] || 0;
      stat.percentage = stat.scheduled > 0
        ? Math.round((stat.completed / stat.scheduled) * 100)
        : 0;
    });

    // Sort by percentage descending to get best first
    const sorted = [...dayStats].sort((a, b) => b.percentage - a.percentage);

    // Find best and worst
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];

    res.json({
      dayStats,
      best: best.scheduled > 0 ? best : null,
      worst: worst.scheduled > 0 ? worst : null
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET /api/insights/habit/:habitId?period=month
// Detailed analytics for a single habit
// ==========================================
const getHabitInsight = async (req, res, next) => {
  try {
    const { habitId } = req.params;
    const { period = 'month' } = req.query;
    const today = getTodayStr();

    // Verify habit belongs to user
    const habit = await Habit.findOne({
      _id: habitId,
      userId: req.user._id
    }).lean();

    if (!habit) {
      return res.status(404).json({
        error: { message: 'Habit not found' }
      });
    }

    // Calculate date range
    let startDate;
    switch (period) {
      case 'week':
        startDate = subtractDays(today, 7);
        break;
      case 'month':
        startDate = subtractDays(today, 30);
        break;
      case 'year':
        startDate = subtractDays(today, 365);
        break;
      case 'all':
        startDate = '2000-01-01';
        break;
      default:
        startDate = subtractDays(today, 30);
    }

    // Get completions for this habit
    const completions = await Completion.find({
      habitId,
      date: { $gte: startDate, $lte: today }
    })
      .sort({ date: 1 })
      .lean();

    // Calculate scheduled days in period
    const dateRange = getDateRange(startDate, today);
    let scheduledDays = 0;

    dateRange.forEach(date => {
      const dayOfWeek = getDayOfWeek(date);
      if (isHabitScheduledForDay(habit, dayOfWeek)) {
        scheduledDays++;
      }
    });

    const completedDays = completions.length;
    const completionRate = scheduledDays > 0
      ? Math.round((completedDays / scheduledDays) * 100)
      : 0;

    // Build completion calendar (array of dates)
    const completedDates = completions.map(c => c.date);

    // Calculate average completions per week
    const weeks = Math.ceil(dateRange.length / 7);
    const avgPerWeek = weeks > 0 ? (completedDays / weeks).toFixed(1) : 0;

    res.json({
      habit: {
        _id: habit._id,
        name: habit.name,
        emoji: habit.emoji,
        color: habit.color,
        category: habit.category,
        frequency: habit.frequency,
        currentStreak: habit.currentStreak,
        longestStreak: habit.longestStreak,
        totalCompletions: habit.totalCompletions
      },
      period,
      analytics: {
        completedDays,
        scheduledDays,
        completionRate,
        avgPerWeek,
        completedDates
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET /api/insights/comparison?current=week&previous=week
// Compare two time periods
// ==========================================
const getComparison = async (req, res, next) => {
  try {
    const { current = 'week', previous = 'week' } = req.query;
    const today = getTodayStr();

    // Calculate current period
    let currentStart;
    let currentDays;
    switch (current) {
      case 'week':
        currentDays = 7;
        currentStart = subtractDays(today, 6); // last 7 days including today
        break;
      case 'month':
        currentDays = 30;
        currentStart = subtractDays(today, 29);
        break;
      default:
        currentDays = 7;
        currentStart = subtractDays(today, 6);
    }

    // Calculate previous period (same length, immediately before current)
    let previousDays;
    switch (previous) {
      case 'week':
        previousDays = 7;
        break;
      case 'month':
        previousDays = 30;
        break;
      default:
        previousDays = 7;
    }

    const previousStart = subtractDays(currentStart, previousDays);
    const previousEnd = subtractDays(currentStart, 1);

    // Get active habits
    const habits = await Habit.find({
      userId: req.user._id,
      isArchived: false
    }).lean();

    if (habits.length === 0) {
      return res.json({
        current: { completionRate: 0, totalCompletions: 0 },
        previous: { completionRate: 0, totalCompletions: 0 },
        change: { absolute: 0, percentage: 0 }
      });
    }

    const habitIds = habits.map(h => h._id);

    // Get completions for both periods
    const currentCompletions = await Completion.countDocuments({
      habitId: { $in: habitIds },
      date: { $gte: currentStart, $lte: today }
    });

    const previousCompletions = await Completion.countDocuments({
      habitId: { $in: habitIds },
      date: { $gte: previousStart, $lte: previousEnd }
    });

    // Calculate scheduled instances for both periods
    const currentDateRange = getDateRange(currentStart, today);
    const previousDateRange = getDateRange(previousStart, previousEnd);

    let currentScheduled = 0;
    currentDateRange.forEach(date => {
      const dayOfWeek = getDayOfWeek(date);
      habits.forEach(habit => {
        if (isHabitScheduledForDay(habit, dayOfWeek)) {
          currentScheduled++;
        }
      });
    });

    let previousScheduled = 0;
    previousDateRange.forEach(date => {
      const dayOfWeek = getDayOfWeek(date);
      habits.forEach(habit => {
        if (isHabitScheduledForDay(habit, dayOfWeek)) {
          previousScheduled++;
        }
      });
    });

    const currentRate = currentScheduled > 0
      ? Math.round((currentCompletions / currentScheduled) * 100)
      : 0;

    const previousRate = previousScheduled > 0
      ? Math.round((previousCompletions / previousScheduled) * 100)
      : 0;

    const absoluteChange = currentRate - previousRate;
    const percentageChange = previousRate > 0
      ? Math.round(((currentRate - previousRate) / previousRate) * 100)
      : 0;

    res.json({
      current: {
        period: current,
        completionRate: currentRate,
        totalCompletions: currentCompletions,
        scheduled: currentScheduled,
        days: currentDateRange.length
      },
      previous: {
        period: previous,
        completionRate: previousRate,
        totalCompletions: previousCompletions,
        scheduled: previousScheduled,
        days: previousDateRange.length
      },
      change: {
        absolute: absoluteChange, // +12 means 12 percentage points better
        percentage: percentageChange, // +25 means 25% improvement
        improved: absoluteChange > 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Helper: Check if a habit is scheduled for a day of week
// ==========================================
const isHabitScheduledForDay = (habit, dayOfWeek) => {
  const freq = habit.frequency;

  if (freq.type === 'daily') {
    return true;
  }

  if (freq.type === 'specific_days') {
    return freq.days.includes(dayOfWeek);
  }

  if (freq.type === 'x_per_week') {
    // For weekly targets, consider all days as "scheduled"
    return true;
  }

  return false;
};

module.exports = {
  getOverview,
  getStreaks,
  getDailyTrend,
  getBestWorstDays,
  getHabitInsight,
  getComparison
};