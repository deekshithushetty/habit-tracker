/**
 * Get today's date as YYYY-MM-DD string
 */
const getTodayStr = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Convert a YYYY-MM-DD string to a Date object (at midnight UTC)
 */
const parseDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

/**
 * Format a Date object to YYYY-MM-DD string
 */
const formatDate = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get the day of week (0=Sunday, 6=Saturday) from a YYYY-MM-DD string
 */
const getDayOfWeek = (dateStr) => {
  return parseDate(dateStr).getUTCDay();
};

/**
 * Subtract N days from a date string, return new date string
 */
const subtractDays = (dateStr, days) => {
  const date = parseDate(dateStr);
  date.setUTCDate(date.getUTCDate() - days);
  return formatDate(date);
};

/**
 * Add N days to a date string, return new date string
 */
const addDays = (dateStr, days) => {
  const date = parseDate(dateStr);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDate(date);
};

/**
 * Get all dates between start and end (inclusive) as YYYY-MM-DD strings
 */
const getDateRange = (startStr, endStr) => {
  const dates = [];
  let current = parseDate(startStr);
  const end = parseDate(endStr);

  while (current <= end) {
    dates.push(formatDate(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
};

/**
 * Get the start of the week (Monday or Sunday) for a given date string
 */
const getWeekStart = (dateStr, weekStartsOn = 1) => {
  const date = parseDate(dateStr);
  const day = date.getUTCDay();
  // Calculate how many days back to go
  const diff = (day - weekStartsOn + 7) % 7;
  date.setUTCDate(date.getUTCDate() - diff);
  return formatDate(date);
};

/**
 * Get the end of the week for a given date string
 */
const getWeekEnd = (dateStr, weekStartsOn = 1) => {
  const start = getWeekStart(dateStr, weekStartsOn);
  return addDays(start, 6);
};

module.exports = {
  getTodayStr,
  parseDate,
  formatDate,
  getDayOfWeek,
  subtractDays,
  addDays,
  getDateRange,
  getWeekStart,
  getWeekEnd
};