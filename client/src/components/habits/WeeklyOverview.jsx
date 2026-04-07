import { Card } from '@/components/ui';
import { getWeekDates, getDayShort, isDateToday } from '@/lib/dates';
import { Calendar, Check } from 'lucide-react';

export const WeeklyOverview = ({
  habits,
  completionsByDate,
  isLoading
}) => {
  const weekDates = getWeekDates();

  const getDayStats = (date) => {
    const dayOfWeek = new Date(date).getDay();
    const scheduledHabits = habits?.filter((habit) => {
      if (habit.frequency.type === 'daily') return true;
      if (habit.frequency.type === 'specific_days') {
        return habit.frequency.days.includes(dayOfWeek);
      }
      if (habit.frequency.type === 'x_per_week') return true;
      return false;
    }) || [];

    const scheduledCount = scheduledHabits.length;
    const completedHabitIds = completionsByDate?.[date] || [];
    const completedCount = completedHabitIds.length;
    const percentage = scheduledCount > 0 ? (completedCount / scheduledCount) * 100 : 0;

    return { scheduledCount, completedCount, percentage };
  };

  const getColorClasses = (percentage) => {
    if (percentage === 0) return 'bg-surface-100 dark:bg-surface-800 border-surface-200 dark:border-surface-700';
    if (percentage < 50) return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700';
    if (percentage < 100) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
    return 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700';
  };

  if (isLoading) {
    return (
      <Card>
        <div className="flex justify-between gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-6 h-3 skeleton rounded" />
              <div className="w-10 h-10 skeleton rounded-xl" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <Calendar size={16} className="text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="font-semibold text-surface-900 dark:text-white">
          This Week
        </h3>
      </div>

      <div className="flex justify-between gap-1">
        {weekDates.map((date) => {
          const stats = getDayStats(date);
          const isToday = isDateToday(date);
          const isComplete = stats.percentage === 100 && stats.scheduledCount > 0;

          return (
            <div key={date} className="flex flex-col items-center gap-2 flex-1">
              <span className={`
                text-xs font-semibold
                ${isToday 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-surface-400 dark:text-surface-500'
                }
              `}>
                {getDayShort(date)}
              </span>
              
              <div
                className={`
                  w-full aspect-square max-w-[44px] rounded-xl border-2
                  flex items-center justify-center
                  transition-all duration-300
                  ${getColorClasses(stats.percentage)}
                  ${isToday ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-white dark:ring-offset-surface-900' : ''}
                `}
              >
                {isComplete ? (
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
                ) : stats.percentage > 0 ? (
                  <span className="text-xs font-bold text-surface-600 dark:text-surface-300">
                    {Math.round(stats.percentage)}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-surface-100 dark:border-surface-800">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700" />
          <span className="text-xs text-surface-500 dark:text-surface-400">0%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700" />
          <span className="text-xs text-surface-500 dark:text-surface-400">&lt;50%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700" />
          <span className="text-xs text-surface-500 dark:text-surface-400">&lt;100%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700" />
          <span className="text-xs text-surface-500 dark:text-surface-400">Done</span>
        </div>
      </div>
    </Card>
  );
};