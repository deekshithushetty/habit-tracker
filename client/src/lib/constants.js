export const CATEGORIES = [
  { value: 'health', label: 'Health', emoji: '🏃', color: '#10b981' },
  { value: 'mind', label: 'Mind', emoji: '🧠', color: '#8b5cf6' },
  { value: 'productivity', label: 'Productivity', emoji: '⚡', color: '#f59e0b' },
  { value: 'learning', label: 'Learning', emoji: '📚', color: '#3b82f6' },
  { value: 'social', label: 'Social', emoji: '👥', color: '#ec4899' },
  { value: 'custom', label: 'Custom', emoji: '✨', color: '#6b7280' }
];

export const FREQUENCY_TYPES = [
  { value: 'daily', label: 'Every day' },
  { value: 'specific_days', label: 'Specific days' },
  { value: 'x_per_week', label: 'Times per week' }
];

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun', fullLabel: 'Sunday' },
  { value: 1, label: 'Mon', fullLabel: 'Monday' },
  { value: 2, label: 'Tue', fullLabel: 'Tuesday' },
  { value: 3, label: 'Wed', fullLabel: 'Wednesday' },
  { value: 4, label: 'Thu', fullLabel: 'Thursday' },
  { value: 5, label: 'Fri', fullLabel: 'Friday' },
  { value: 6, label: 'Sat', fullLabel: 'Saturday' }
];

export const HABIT_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#ef4444', // Red
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#6b7280'  // Gray
];

export const HABIT_EMOJIS = [
  '🏃', '🧘', '📖', '💧', '🎸', '✍️', '💊', '📵',
  '🥗', '😴', '🧠', '💪', '🚶', '🎯', '📝', '🌅',
  '🧹', '💰', '📞', '🎨', '🌿', '☕', '🍎', '🚿'
];

export const MOTIVATIONAL_QUOTES = [
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "We are what we repeatedly do. Excellence is not an act, but a habit.", author: "Aristotle" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "You'll never change your life until you change something you do daily.", author: "John C. Maxwell" },
  { text: "First we make our habits, then our habits make us.", author: "John Dryden" },
  { text: "The chains of habit are too light to be felt until they are too heavy to be broken.", author: "Warren Buffett" },
  { text: "Habits are the compound interest of self-improvement.", author: "James Clear" },
  { text: "Your net worth to the world is usually determined by what remains after your bad habits are subtracted from your good ones.", author: "Benjamin Franklin" }
];

export const getRandomQuote = () => {
  // Use date as seed for consistent daily quote
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
};

export const getCategoryByValue = (value) => {
  return CATEGORIES.find(c => c.value === value) || CATEGORIES[5]; // default to custom
};