import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useHabits, useCompletionsByDate, useCompletionRange } from '@/hooks';
import {
  TodayHabitsList,
  StreakCard,
  WeeklyOverview,
  QuoteCard
} from '@/components/habits';
import { PageSpinner } from '@/components/ui';
import { getTodayStr, getGreeting, subtractDaysFromDate } from '@/lib/dates';
import { Sparkles } from 'lucide-react';

export const Home = () => {
  const { user } = useAuth();
  const today = getTodayStr();
  const weekAgo = subtractDaysFromDate(today, 6);

  const { data: habits, isLoading: habitsLoading } = useHabits();
  const { data: todayCompletions, isLoading: completionsLoading } = useCompletionsByDate(today);
  const { data: weekCompletions, isLoading: weekLoading } = useCompletionRange(weekAgo, today);

  const todayHabits = useMemo(() => {
    if (!habits) return [];
    const dayOfWeek = new Date().getDay();
    return habits.filter((habit) => {
      // Don't show habits that haven't started yet
      if (habit.startDate && habit.startDate > today) return false;
      if (habit.frequency.type === 'daily') return true;
      if (habit.frequency.type === 'specific_days') {
        return habit.frequency.days.includes(dayOfWeek);
      }
      if (habit.frequency.type === 'x_per_week') return true;
      return false;
    });
  }, [habits, today]);

  const todayScheduledCount = todayHabits.length;
  const completedCount = todayCompletions?.totalCompleted || 0;
  const isLoading = habitsLoading || completionsLoading;

  if (isLoading && !habits) {
    return <PageSpinner />;
  }

  const firstName = user?.name?.split(' ')[0];

  return (
    <div className="px-5 pt-14 pb-6">
      {/* Header with greeting */}
      <div className="mb-8 animate-slide-up">
        <div className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 mb-2">
          <Sparkles size={16} />
          <span>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
          {getGreeting()}, <span className="text-gradient">{firstName}</span> 👋
        </h1>
        <p className="text-surface-500 dark:text-surface-400 mt-2">
          {todayScheduledCount === 0 
            ? "No habits scheduled for today. Enjoy your day!" 
            : completedCount === todayScheduledCount
              ? "Amazing work! You've completed all your habits today! 🎉"
              : `You have ${todayScheduledCount - completedCount} habit${todayScheduledCount - completedCount !== 1 ? 's' : ''} left today`
          }
        </p>
      </div>

      {/* Main content */}
      <div className="space-y-6">
        {/* Streak & Progress Card */}
        <div className="animate-slide-up stagger-1">
          <StreakCard
            habits={habits}
            completions={todayCompletions?.completions}
            todayScheduledCount={todayScheduledCount}
            completedCount={completedCount}
          />
        </div>

        {/* Today's Habits */}
        <div className="animate-slide-up stagger-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">
              Today's Habits
            </h2>
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 px-3 py-1 rounded-full">
              {completedCount}/{todayScheduledCount}
            </span>
          </div>
          <TodayHabitsList
            habits={todayHabits}
            completions={todayCompletions?.completions}
            date={today}
            isLoading={habitsLoading || completionsLoading}
          />
        </div>

        {/* Motivational Quote */}
        {user?.preferences?.showQuotes !== false && (
          <div className="animate-slide-up stagger-3">
            <QuoteCard />
          </div>
        )}

        {/* Weekly Overview */}
        <div className="animate-slide-up stagger-4">
          <WeeklyOverview
            habits={habits}
            completionsByDate={weekCompletions?.completionsByDate}
            isLoading={weekLoading}
          />
        </div>
      </div>
    </div>
  );
};