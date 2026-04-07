import { Card } from '@/components/ui';

export const WeekdayBreakdown = ({
  data,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card>
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="w-10 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!data || !data.dayStats) {
    return null;
  }

  // Sort days starting from Monday
  const sortedDays = [...data.dayStats].sort((a, b) => {
    // Convert Sunday (0) to 7 for sorting, keep Monday (1) as 1
    const aSort = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
    const bSort = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
    return aSort - bSort;
  });

  const maxPercentage = Math.max(...sortedDays.map(d => d.percentage), 1);

  const getBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        By Day of Week
      </h3>

      <div className="space-y-3">
        {sortedDays.map((day) => (
          <div key={day.dayOfWeek} className="flex items-center gap-3">
            <span className="w-10 text-sm text-gray-600 dark:text-gray-400">
              {day.dayName.substring(0, 3)}
            </span>

            <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <div
                className={`h-full ${getBarColor(day.percentage)} rounded-lg transition-all duration-500 flex items-center justify-end pr-2`}
                style={{ width: `${Math.max((day.percentage / maxPercentage) * 100, day.percentage > 0 ? 15 : 0)}%` }}
              >
                {day.percentage > 20 && (
                  <span className="text-xs font-semibold text-white">
                    {day.percentage}%
                  </span>
                )}
              </div>
            </div>

            {day.percentage <= 20 && (
              <span className="w-12 text-sm text-gray-500 dark:text-gray-400 text-right">
                {day.percentage}%
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};