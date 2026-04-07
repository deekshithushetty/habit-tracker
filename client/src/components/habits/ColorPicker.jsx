import { HABIT_COLORS } from '@/lib/constants';
import { Check } from 'lucide-react';

export const ColorPicker = ({
  selected,
  onSelect
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Color
      </label>
      <div className="grid grid-cols-9 gap-2">
        {HABIT_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            className={`
              w-10 h-10 rounded-lg
              flex items-center justify-center
              transition-all duration-200
              ${selected === color ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 scale-110' : ''}
            `}
            style={{
              backgroundColor: color,
              ringColor: color
            }}
          >
            {selected === color && (
              <Check size={18} className="text-white" strokeWidth={3} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};