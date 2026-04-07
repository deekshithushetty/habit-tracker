import { Card, ProgressRing } from '@/components/ui';
import { TrendingUp, TrendingDown, Minus, Target, CheckCircle, Calendar } from 'lucide-react';

export const OverviewCard = ({
  data,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center gap-6 animate-pulse">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card>
      <div className="flex items-center gap-6">
        {/* Progress Ring */}
        <ProgressRing
          progress={data.completionRate}
          size={96}
          strokeWidth={8}
        />

        {/* Stats */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Completion Rate
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {data.completionRate}%
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {data.totalCompletions} of {data.totalScheduled} completed
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
            <Target size={20} className="text-primary-600 dark:text-primary-400" />
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {data.totalHabits}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Active Habits
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-lg bg-green-100 dark:bg-green-900/30">
            <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {data.totalCompletions}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Completions
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {data.daysInPeriod}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Days
          </p>
        </div>
      </div>
    </Card>
  );
};