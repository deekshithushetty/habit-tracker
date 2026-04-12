import { MoreVertical, Archive, Edit, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { getCategoryByValue } from '@/lib/constants';
import { Emoji } from '@/components/ui';

export const HabitCard = ({
  habit,
  onEdit,
  onArchive,
  onDelete
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const category = getCategoryByValue(habit.category);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const getFrequencyLabel = () => {
    const freq = habit.frequency;
    if (freq.type === 'daily') return 'Daily';
    if (freq.type === 'specific_days') {
      const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return freq.days.map(d => dayLabels[d]).join(', ');
    }
    if (freq.type === 'x_per_week') return `${freq.timesPerWeek}× per week`;
    return '';
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 relative">
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${habit.color}20` }}
        >
          <Emoji size="lg">{habit.emoji}</Emoji>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {habit.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {getFrequencyLabel()}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              <Emoji size="xs">{category.emoji}</Emoji>
              <span>{category.label}</span>
            </span>
          </div>
        </div>

        {/* Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <MoreVertical size={18} className="text-gray-500 dark:text-gray-400" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
              <button
                onClick={() => { onEdit(habit); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => { onArchive(habit); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Archive size={16} />
                {habit.isArchived ? 'Restore' : 'Archive'}
              </button>
              <button
                onClick={() => { onDelete(habit); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-1.5">
          <Emoji size="sm">🔥</Emoji>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {habit.currentStreak}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">streak</span>
        </div>
        <div className="text-sm text-gray-400">•</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {habit.totalCompletions} total
        </div>
        {habit.startDate && (
          <>
            <div className="text-sm text-gray-400">•</div>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <span>📅</span>
              <span>Started {new Date(habit.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};