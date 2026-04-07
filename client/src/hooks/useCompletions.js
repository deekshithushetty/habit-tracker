import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { completionsApi } from '@/api';
import { queryKeys } from '@/lib/queryClient';

export const useCompletionsByDate = (date, options = {}) => {
  return useQuery({
    queryKey: queryKeys.completions(date),
    queryFn: () => completionsApi.getByDate(date),
    enabled: !!date,
    ...options
  });
};

export const useCompletionRange = (from, to, options = {}) => {
  return useQuery({
    queryKey: queryKeys.completionRange(from, to),
    queryFn: () => completionsApi.getRange(from, to),
    enabled: !!from && !!to,
    ...options
  });
};

export const useToggleCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitId, date }) => completionsApi.toggle(habitId, date),

    // Optimistic update
    onMutate: async ({ habitId, date }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.completions(date) });
      await queryClient.cancelQueries({ queryKey: queryKeys.habits });

      // Snapshot previous values
      const previousCompletions = queryClient.getQueryData(queryKeys.completions(date));
      const previousHabits = queryClient.getQueryData(queryKeys.habits);

      // Optimistically update completions
      queryClient.setQueryData(queryKeys.completions(date), (old) => {
        if (!old) return old;

        const completions = { ...old.completions };
        const isCurrentlyCompleted = !!completions[habitId];

        if (isCurrentlyCompleted) {
          delete completions[habitId];
        } else {
          completions[habitId] = {
            _id: 'temp-' + Date.now(),
            date,
            completed: true,
            createdAt: new Date().toISOString()
          };
        }

        return {
          ...old,
          completions,
          totalCompleted: Object.keys(completions).length
        };
      });

      // Optimistically update habit streak
      queryClient.setQueryData(queryKeys.habits, (old) => {
        if (!old) return old;

        return {
          ...old,
          habits: old.habits.map((habit) => {
            if (habit._id !== habitId) return habit;

            const completionsData = queryClient.getQueryData(queryKeys.completions(date));
            const wasCompleted = previousCompletions?.completions?.[habitId];

            // Simple optimistic streak update
            const streakDelta = wasCompleted ? -1 : 1;

            return {
              ...habit,
              currentStreak: Math.max(0, habit.currentStreak + streakDelta),
              totalCompletions: Math.max(0, habit.totalCompletions + streakDelta)
            };
          })
        };
      });

      return { previousCompletions, previousHabits };
    },

    // Rollback on error
    onError: (err, { date }, context) => {
      if (context?.previousCompletions) {
        queryClient.setQueryData(queryKeys.completions(date), context.previousCompletions);
      }
      if (context?.previousHabits) {
        queryClient.setQueryData(queryKeys.habits, context.previousHabits);
      }
    },

    // Refetch after success to get accurate streak data
    onSettled: (data, error, { date }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.completions(date) });
      queryClient.invalidateQueries({ queryKey: queryKeys.habits });
      // Also invalidate weekly completions for the overview
      queryClient.invalidateQueries({ queryKey: ['completions', 'range'] });
    }
  });
};