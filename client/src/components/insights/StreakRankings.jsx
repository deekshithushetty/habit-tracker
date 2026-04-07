import { Card } from '@/components/ui';
import { Flame, Trophy } from 'lucide-react';

export const StreakRankings = ({
  streaks,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card>
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!streaks || streaks.length === 0) {
    return (
      <Card>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No habits to show
        </div>
      </Card>
    );
  }

  // Get the max streak for progress bar calculation
  const maxStreak = Math.max(...streaks.map(s => s.currentStreak), 1);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Streak Rankings
        </h3>
        <Flame size={18} className="text-orange-500" />
      </div>

      <div className="space-y-4">
        {streaks.slice(0, 5).map((habit, index) => {
          const isTop = index === 0 && habit.currentStreak > 0;
          const progressWidth = maxStreak > 0 ? (habit.currentStreak / maxStreak) * 100 : 0;

          return (
            <div key={habit._id} className="flex items-center gap-3">
              {/* Rank / Icon */}
              <div
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0
                  ${isTop ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-gray-100 dark:bg-gray-800'}
                `}
              >
                {isTop ? <Trophy size={20} className="text-amber-500" /> : habit.emoji}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {habit.name}
                  </span>
                  <div className="flex items-center gap-1 text-orange-500 flex-shrink-0 ml-2">
                    <Flame size={14} />
                    <span className="text-sm font-bold">{habit.currentStreak}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>

                {/* Best streak */}
                {habit.longestStreak > habit.currentStreak && (
                  <p className="text-xs text-gray-400 mt-1">
                    Best: {habit.longestStreak} days
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {streaks.length > 5 && (
        <p className="text-xs text-gray-400 text-center mt-4">
          +{streaks.length - 5} more habits
        </p>
      )}
    </Card>
  );
};