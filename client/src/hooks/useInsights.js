import { useQuery } from '@tanstack/react-query';
import { insightsApi } from '@/api';
import { queryKeys } from '@/lib/queryClient';

export const useOverview = (period = 'month', options = {}) => {
  return useQuery({
    queryKey: queryKeys.overview(period),
    queryFn: () => insightsApi.getOverview(period),
    ...options
  });
};

export const useStreaks = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.streaks,
    queryFn: () => insightsApi.getStreaks(),
    select: (data) => data.streaks,
    ...options
  });
};

export const useDailyTrend = (period = 'week', options = {}) => {
  return useQuery({
    queryKey: queryKeys.dailyTrend(period),
    queryFn: () => insightsApi.getDailyTrend(period),
    select: (data) => data.trend,
    ...options
  });
};

export const useBestWorstDays = (period = 'month', options = {}) => {
  return useQuery({
    queryKey: queryKeys.bestWorstDays(period),
    queryFn: () => insightsApi.getBestWorstDays(period),
    ...options
  });
};

export const useHabitInsight = (habitId, period = 'month', options = {}) => {
  return useQuery({
    queryKey: queryKeys.habitInsight(habitId, period),
    queryFn: () => insightsApi.getHabitInsight(habitId, period),
    enabled: !!habitId,
    ...options
  });
};

export const useComparison = (current = 'week', previous = 'week', options = {}) => {
  return useQuery({
    queryKey: queryKeys.comparison(current, previous),
    queryFn: () => insightsApi.getComparison(current, previous),
    ...options
  });
};