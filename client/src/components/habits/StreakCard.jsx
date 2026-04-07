import { Emoji } from '@/components/ui';

export const StreakCard = ({
  habits,
  completions,
  todayScheduledCount,
  completedCount
}) => {
  const longestStreak = habits?.reduce((max, habit) => {
    return Math.max(max, habit.currentStreak || 0);
  }, 0) || 0;

  const progressPercentage = todayScheduledCount > 0 
    ? (completedCount / todayScheduledCount) * 100 
    : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 p-5 shadow-lg">
      <div className="relative">
        {/* Top row */}
        <div className="flex items-center justify-between mb-5">
          {/* Streak display */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
              <Emoji size="xl">🔥</Emoji>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">
                {longestStreak}
              </div>
              <div className="text-sm text-white/70">
                day streak
              </div>
            </div>
          </div>

          {/* Today's count */}
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {completedCount}/{todayScheduledCount}
            </div>
            <div className="text-sm text-white/70">
              today
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white/20 rounded-full p-1">
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Completion message */}
        {progressPercentage === 100 && todayScheduledCount > 0 && (
          <div className="mt-3 text-center text-sm font-medium text-white/90 flex items-center justify-center gap-1">
            <Emoji size="sm">🎉</Emoji>
            <span>All done for today!</span>
          </div>
        )}
      </div>
    </div>
  );
};