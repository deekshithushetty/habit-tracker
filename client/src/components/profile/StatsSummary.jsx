import { Card } from '@/components/ui';
import { useHabits, useOverview, useStreaks } from '@/hooks';
import { Target, CheckCircle, Flame, Trophy } from 'lucide-react';

export const StatsSummary = () => {
  const { data: habits, isLoading: habitsLoading } = useHabits();
  const { data: overview, isLoading: overviewLoading } = useOverview('all');
  const { data: streaks, isLoading: streaksLoading } = useStreaks();

  const isLoading = habitsLoading || overviewLoading || streaksLoading;

  if (isLoading) {
    return (
      <Card>
        <div className="grid grid-cols-2 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2" />
              <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const activeHabits = habits?.filter(h => !h.isArchived).length || 0;
  const totalCompletions = overview?.totalCompletions || 0;
  const completionRate = overview?.completionRate || 0;
  
  // Find best current streak
  const bestStreak = streaks?.reduce((max, h) => Math.max(max, h.currentStreak || 0), 0) || 0;
  
  // Find longest streak ever
  const longestEver = streaks?.reduce((max, h) => Math.max(max, h.longestStreak || 0), 0) || 0;

  const stats = [
    {
      icon: Target,
      value: activeHabits,
      label: 'Active Habits',
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30'
    },
    {
      icon: CheckCircle,
      value: totalCompletions,
      label: 'Total Completions',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      icon: Flame,
      value: bestStreak,
      label: 'Current Best Streak',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    },
    {
      icon: Trophy,
      value: longestEver,
      label: 'Longest Streak Ever',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30'
    }
  ];

  return (
    <Card padding="sm">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-2">
        Your Stats
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
          >
            <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};