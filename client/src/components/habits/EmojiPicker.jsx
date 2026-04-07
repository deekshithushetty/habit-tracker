import { HABIT_EMOJIS } from '@/lib/constants';
import { Emoji } from '@/components/ui';

export const EmojiPicker = ({
  selected,
  onSelect
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Icon
      </label>
      <div className="grid grid-cols-8 gap-2">
        {HABIT_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSelect(emoji)}
            className={`
              w-10 h-10 rounded-lg
              flex items-center justify-center
              transition-all duration-200
              ${selected === emoji
                ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500 scale-110'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            <Emoji size="md">{emoji}</Emoji>
          </button>
        ))}
      </div>
    </div>
  );
};