import { Card } from '@/components/ui';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const BestWorstDays = ({
  data,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card>
        <div className="flex gap-4 animate-pulse">
          <div className="flex-1 h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="flex-1 h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      </Card>
    );
  }

  if (!data || !data.best || !data.worst) {
    return (
      <Card>
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          Not enough data yet
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        Best & Worst Days
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Best Day */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <TrendingUp size={16} className="text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase">
              Best
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {data.best.dayName}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.best.percentage}% completion
          </p>
        </div>

        {/* Worst Day */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
              <TrendingDown size={16} className="text-red-600 dark:text-red-400" />
            </div>
            <span className="text-xs font-medium text-red-600 dark:text-red-400 uppercase">
              Needs Work
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {data.worst.dayName}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.worst.percentage}% completion
          </p>
        </div>
      </div>
    </Card>
  );
};