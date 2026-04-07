import { HabitCheckbox } from './HabitCheckbox';
import { Emoji } from '@/components/ui';

export const HabitRow = ({
  habit,
  date,
  isCompleted,
  showStreak = true
}) => {
  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-xl
        transition-all duration-200
        ${isCompleted
          ? 'bg-gray-50 dark:bg-gray-800/50'
          : 'bg-white dark:bg-gray-900'
        }
      `}
    >
      {/* Checkbox */}
      <HabitCheckbox
        habitId={habit._id}
        date={date}
        isCompleted={isCompleted}
        color={habit.color}
      />

      {/* Emoji - using image-based component */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${habit.color}20` }}
      >
        <Emoji size="md">{habit.emoji}</Emoji>
      </div>

      {/* Name */}
      <span
        className={`
          flex-1 font-medium transition-all duration-200
          ${isCompleted
            ? 'text-gray-400 dark:text-gray-500 line-through'
            : 'text-gray-900 dark:text-white'
          }
        `}
      >
        {habit.name}
      </span>

      {/* Streak */}
      {showStreak && habit.currentStreak > 0 && (
        <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-2.5 py-1 rounded-full">
          <Emoji size="xs">🔥</Emoji>
          <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
            {habit.currentStreak}
          </span>
        </div>
      )}
    </div>
  );
};