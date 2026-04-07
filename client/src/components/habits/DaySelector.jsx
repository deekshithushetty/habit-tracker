import { DAYS_OF_WEEK } from '@/lib/constants';

export const DaySelector = ({
  selectedDays = [],
  onChange
}) => {
  const toggleDay = (dayValue) => {
    if (selectedDays.includes(dayValue)) {
      onChange(selectedDays.filter(d => d !== dayValue));
    } else {
      onChange([...selectedDays, dayValue].sort());
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Days of the week
      </label>
      <div className="grid grid-cols-7 gap-2">
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = selectedDays.includes(day.value);
          return (
            <button
              key={day.value}
              type="button"
              onClick={() => toggleDay(day.value)}
              className={`
                py-2 px-1 rounded-lg text-sm font-medium
                transition-all duration-200
                ${isSelected
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              {day.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};