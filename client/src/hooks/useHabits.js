import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitsApi } from '@/api';
import { queryKeys } from '@/lib/queryClient';

export const useHabits = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.habits,
    queryFn: () => habitsApi.getAll(),
    select: (data) => data.habits,
    ...options
  });
};

export const useHabit = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.habit(id),
    queryFn: () => habitsApi.getOne(id),
    select: (data) => data.habit,
    enabled: !!id,
    ...options
  });
};

export const useCreateHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => habitsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits });
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    }
  });
};

export const useUpdateHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => habitsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits });
      queryClient.invalidateQueries({ queryKey: queryKeys.habit(id) });
    }
  });
};

export const useArchiveHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => habitsApi.archive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits });
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    }
  });
};

export const useDeleteHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => habitsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits });
      queryClient.invalidateQueries({ queryKey: ['insights'] });
      queryClient.invalidateQueries({ queryKey: ['completions'] });
    }
  });
};