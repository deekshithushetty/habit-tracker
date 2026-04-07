export const PeriodSelector = ({
  selected,
  onChange,
  options = ['week', 'month', 'year']
}) => {
  const labels = {
    week: '7 Days',
    month: '30 Days',
    year: 'Year',
    all: 'All Time'
  };

  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`
            flex-1 px-3 py-2 text-sm font-medium rounded-lg
            transition-all duration-200
            ${selected === option
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }
          `}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );
};