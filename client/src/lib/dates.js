import { format, parseISO, isToday, isYesterday, addDays, subDays } from 'date-fns';

export const getTodayStr = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const formatDate = (dateStr, formatStr = 'MMM d, yyyy') => {
  return format(parseISO(dateStr), formatStr);
};

export const formatDateShort = (dateStr) => {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'EEE, MMM d');
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const getDayName = (dateStr) => {
  return format(parseISO(dateStr), 'EEEE');
};

export const getDayShort = (dateStr) => {
  return format(parseISO(dateStr), 'EEE');
};

export const addDaysToDate = (dateStr, days) => {
  return format(addDays(parseISO(dateStr), days), 'yyyy-MM-dd');
};

export const subtractDaysFromDate = (dateStr, days) => {
  return format(subDays(parseISO(dateStr), days), 'yyyy-MM-dd');
};

export const getWeekDates = (startDate = getTodayStr()) => {
  const dates = [];
  const start = subDays(parseISO(startDate), 6); // Last 7 days including today

  for (let i = 0; i < 7; i++) {
    dates.push(format(addDays(start, i), 'yyyy-MM-dd'));
  }

  return dates;
};

export const isDateToday = (dateStr) => {
  return isToday(parseISO(dateStr));
};