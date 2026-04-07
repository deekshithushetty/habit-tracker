import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (error?.response?.status === 401) return false;
        if (error?.response?.status === 403) return false;
        if (error?.response?.status === 404) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: false
    }
  }
});

// Query key factory for consistent keys
export const queryKeys = {
  // Auth
  user: ['user'],

  // Habits
  habits: ['habits'],
  habit: (id) => ['habits', id],
  archivedHabits: ['habits', 'archived'],

  // Completions
  completions: (date) => ['completions', date],
  completionRange: (from, to) => ['completions', 'range', from, to],
  habitHistory: (habitId, from, to) => ['completions', 'history', habitId, from, to],

  // Insights
  overview: (period) => ['insights', 'overview', period],
  streaks: ['insights', 'streaks'],
  dailyTrend: (period) => ['insights', 'daily-trend', period],
  bestWorstDays: (period) => ['insights', 'best-worst-days', period],
  habitInsight: (habitId, period) => ['insights', 'habit', habitId, period],
  comparison: (current, previous) => ['insights', 'comparison', current, previous]
};