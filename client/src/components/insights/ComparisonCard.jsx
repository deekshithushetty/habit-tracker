import { Card } from '@/components/ui';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';

export const ComparisonCard = ({
  data,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="flex items-center justify-between">
            <div className="h-12 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-12 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </Card>
    );
  }

  if (!data) return null;

  const { current, previous, change } = data;
  const isPositive = change.absolute > 0;
  const isNeutral = change.absolute === 0;

  return (
    <Card className={`
      ${isPositive
        ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800'
        : isNeutral
          ? 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50'
          : 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800'
      }
    `}>
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        This Week vs Last Week
      </h3>

      <div className="flex items-center justify-between">
        {/* Previous */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Week</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {previous.completionRate}%
          </p>
        </div>

        {/* Arrow / Change indicator */}
        <div className="flex flex-col items-center">
          <ArrowRight size={24} className="text-gray-400 mb-1" />
          <div className={`
            flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold
            ${isPositive
              ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
              : isNeutral
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
            }
          `}>
            {isPositive ? (
              <TrendingUp size={14} />
            ) : isNeutral ? (
              <Minus size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            <span>{isPositive ? '+' : ''}{change.absolute}%</span>
          </div>
        </div>

        {/* Current */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">This Week</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {current.completionRate}%
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="flex justify-between mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
        <span>{previous.totalCompletions} completions</span>
        <span>{current.totalCompletions} completions</span>
      </div>
    </Card>
  );
};