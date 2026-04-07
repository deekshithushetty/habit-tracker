import { useState } from 'react';
import {
  useOverview,
  useStreaks,
  useDailyTrend,
  useBestWorstDays,
  useComparison
} from '@/hooks';
import {
  PeriodSelector,
  OverviewCard,
  DailyTrendChart,
  StreakRankings,
  BestWorstDays,
  ComparisonCard,
  WeekdayBreakdown
} from '@/components/insights';
import { PageSpinner } from '@/components/ui';

export const Insights = () => {
  const [period, setPeriod] = useState('month');
  const [chartPeriod, setChartPeriod] = useState('week');

  // Fetch data
  const { data: overview, isLoading: overviewLoading } = useOverview(period);
  const { data: streaks, isLoading: streaksLoading } = useStreaks();
  const { data: dailyTrend, isLoading: trendLoading } = useDailyTrend(chartPeriod);
  const { data: bestWorst, isLoading: bestWorstLoading } = useBestWorstDays(period);
  const { data: comparison, isLoading: comparisonLoading } = useComparison('week', 'week');

  const isInitialLoading = overviewLoading && !overview;

  if (isInitialLoading) {
    return <PageSpinner />;
  }

  return (
    <div className="px-4 pt-12 pb-6 space-y-4">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Insights
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track your habit performance
        </p>
      </div>

      {/* Period Selector */}
      <PeriodSelector
        selected={period}
        onChange={setPeriod}
        options={['week', 'month', 'year']}
      />

      {/* Overview Card */}
      <OverviewCard
        data={overview}
        isLoading={overviewLoading}
      />

      {/* Comparison Card */}
      <ComparisonCard
        data={comparison}
        isLoading={comparisonLoading}
      />

      {/* Daily Trend Chart */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Daily Trend
          </h2>
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            {['week', 'month'].map((p) => (
              <button
                key={p}
                onClick={() => setChartPeriod(p)}
                className={`
                  px-3 py-1 text-xs font-medium rounded-md transition-colors
                  ${chartPeriod === p
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                {p === 'week' ? '7D' : '30D'}
              </button>
            ))}
          </div>
        </div>
        <DailyTrendChart
          data={dailyTrend}
          isLoading={trendLoading}
          period={chartPeriod}
        />
      </div>

      {/* Streak Rankings */}
      <StreakRankings
        streaks={streaks}
        isLoading={streaksLoading}
      />

      {/* Best / Worst Days */}
      <BestWorstDays
        data={bestWorst}
        isLoading={bestWorstLoading}
      />

      {/* Weekday Breakdown */}
      <WeekdayBreakdown
        data={bestWorst}
        isLoading={bestWorstLoading}
      />

      {/* Empty state message if no data */}
      {overview && overview.totalHabits === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            No data yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start completing habits to see your insights
          </p>
        </div>
      )}
    </div>
  );
};