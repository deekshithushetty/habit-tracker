const { getDayOfWeek, subtractDays, getWeekStart, getWeekEnd, getDateRange } = require('./dateHelpers');

/**
 * Calculate the current streak for a habit.
 *
 * Algorithm:
 * - DAILY: Walk backwards from today. Each scheduled day must have a completion.
 *   First missing day breaks the streak.
 *
 * - SPECIFIC_DAYS: Walk backwards, but skip days not in the schedule.
 *   Only scheduled days count. Missing a non-scheduled day doesn't break it.
 *
 * - X_PER_WEEK: Walk backwards week by week. Each full week must have
 *   at least timesPerWeek completions. Current (partial) week is checked
 *   proportionally.
 *
 * @param {Object} habit - The habit document
 * @param {Array} completions - Array of completion docs sorted by date descending
 * @param {string} today - Today's date as YYYY-MM-DD
 * @returns {number} Current streak count
 */
const calculateStreak = (habit, completions, today) => {
  const freq = habit.frequency;

  // Build a Set of completed dates for O(1) lookup
  const completedDates = new Set(completions.map(c => c.date));

  if (freq.type === 'daily') {
    return calculateDailyStreak(completedDates, today);
  }

  if (freq.type === 'specific_days') {
    return calculateSpecificDaysStreak(completedDates, freq.days, today);
  }

  if (freq.type === 'x_per_week') {
    return calculateWeeklyStreak(completedDates, freq.timesPerWeek, today);
  }

  return 0;
};

/**
 * Daily streak: every single day must be completed
 */
const calculateDailyStreak = (completedDates, today) => {
  let streak = 0;
  let checkDate = today;

  // If today is not completed yet, start checking from yesterday
  // This prevents the streak from showing 0 just because
  // you haven't completed today's habit yet
  if (!completedDates.has(checkDate)) {
    checkDate = subtractDays(checkDate, 1);

    // If yesterday also not completed, streak is 0
    if (!completedDates.has(checkDate)) {
      return 0;
    }
  }

  // Walk backwards
  while (completedDates.has(checkDate)) {
    streak++;
    checkDate = subtractDays(checkDate, 1);
  }

  return streak;
};

/**
 * Specific days streak: only count scheduled days
 * Example: Mon/Wed/Fri habit — missing Tuesday doesn't break it
 */
const calculateSpecificDaysStreak = (completedDates, scheduledDays, today) => {
  let streak = 0;
  let checkDate = today;
  let maxLookback = 365; // safety limit

  // Find the most recent scheduled day (today or before)
  let foundStart = false;
  while (maxLookback > 0) {
    const dayOfWeek = getDayOfWeek(checkDate);

    if (scheduledDays.includes(dayOfWeek)) {
      // This is a scheduled day
      if (!completedDates.has(checkDate)) {
        // If it's today and not yet completed, skip to previous scheduled day
        if (checkDate === today) {
          checkDate = subtractDays(checkDate, 1);
          maxLookback--;
          continue;
        }
        // Past scheduled day not completed — streak broken
        if (foundStart) {
          break;
        }
        // Haven't found any completed scheduled day yet
        return 0;
      }
      // Scheduled day IS completed
      foundStart = true;
      streak++;
    }

    checkDate = subtractDays(checkDate, 1);
    maxLookback--;
  }

  return streak;
};

/**
 * X per week streak: count consecutive weeks meeting the target
 * Returns number of consecutive weeks (not days)
 */
const calculateWeeklyStreak = (completedDates, timesPerWeek, today) => {
  let streak = 0;
  let weekStart = getWeekStart(today, 1); // Monday start
  let maxWeeks = 52; // safety limit — 1 year

  // For the current week, check if target is still achievable
  // We'll be lenient with the current week and start strict checking from last week
  const currentWeekStart = weekStart;
  const currentWeekEnd = getWeekEnd(today, 1);
  const currentWeekDates = getDateRange(currentWeekStart, currentWeekEnd);
  const currentWeekCompletions = currentWeekDates.filter(d => completedDates.has(d)).length;

  // If current week already meets target, count it
  if (currentWeekCompletions >= timesPerWeek) {
    streak++;
  }

  // Check previous weeks
  weekStart = subtractDays(weekStart, 7);

  while (maxWeeks > 0) {
    const weekEnd = getWeekEnd(weekStart, 1);
    const weekDates = getDateRange(weekStart, weekEnd);
    const weekCompletions = weekDates.filter(d => completedDates.has(d)).length;

    if (weekCompletions >= timesPerWeek) {
      streak++;
    } else {
      break; // streak broken
    }

    weekStart = subtractDays(weekStart, 7);
    maxWeeks--;
  }

  return streak;
};

module.exports = {
  calculateStreak
};