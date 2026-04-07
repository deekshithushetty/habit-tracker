import { HabitRow } from './HabitRow';
import { Card, Emoji } from '@/components/ui';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TodayHabitsList = ({
  habits,
  completions,
  date,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 h-5 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!habits || habits.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Plus size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            No habits yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Create your first habit to get started
          </p>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
          >
            <Plus size={18} />
            Add Habit
          </Link>
        </div>
      </Card>
    );
  }

  // Sort: incomplete first, then completed
  const sortedHabits = [...habits].sort((a, b) => {
    const aCompleted = !!completions?.[a._id];
    const bCompleted = !!completions?.[b._id];
    if (aCompleted === bCompleted) return 0;
    return aCompleted ? 1 : -1;
  });

  return (
    <Card padding="sm">
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {sortedHabits.map((habit) => (
          <div key={habit._id} className="py-1 first:pt-0 last:pb-0">
            <HabitRow
              habit={habit}
              date={date}
              isCompleted={!!completions?.[habit._id]}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};