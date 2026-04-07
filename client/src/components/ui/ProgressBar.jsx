export const ProgressBar = ({
  value = 0,
  max = 100,
  showLabel = true,
  size = 'md',
  className = ''
}) => {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {value}/{max}
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} bg-primary-500 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};