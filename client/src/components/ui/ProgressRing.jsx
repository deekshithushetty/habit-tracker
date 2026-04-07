export const ProgressRing = ({
  progress = 0,
  size = 120,
  strokeWidth = 10,
  showPercentage = true,
  color = 'primary',
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const colors = {
    primary: { stroke: '#6366f1', gradient: ['#6366f1', '#8b5cf6'] },
    success: { stroke: '#10b981', gradient: ['#10b981', '#34d399'] },
    warning: { stroke: '#f59e0b', gradient: ['#f59e0b', '#fbbf24'] },
    danger: { stroke: '#ef4444', gradient: ['#ef4444', '#f87171'] }
  };

  const gradientId = `progress-gradient-${color}-${size}`;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[color].gradient[0]} />
            <stop offset="100%" stopColor={colors[color].gradient[1]} />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-surface-100 dark:text-surface-800"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      
      {/* Center content */}
      {showPercentage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-surface-900 dark:text-white">
            {Math.round(progress)}
          </span>
          <span className="text-xs font-medium text-surface-500 dark:text-surface-400 -mt-1">
            percent
          </span>
        </div>
      )}
    </div>
  );
};