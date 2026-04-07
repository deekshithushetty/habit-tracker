export const Card = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  gradient = false,
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8'
  };

  return (
    <div
      className={`
        bg-white dark:bg-surface-900
        border border-surface-200/80 dark:border-surface-800
        rounded-2xl
        shadow-soft
        ${hover ? 'hover-lift hover:shadow-elevated cursor-pointer' : ''}
        ${gradient ? 'bg-gradient-to-br from-white to-surface-50 dark:from-surface-900 dark:to-surface-800' : ''}
        ${paddings[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// Specialized card for stats
export const StatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  trendDirection = 'up',
  color = 'primary',
  className = ''
}) => {
  const colors = {
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
  };

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Decorative gradient blob */}
      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20 ${
        color === 'primary' ? 'bg-primary-500' :
        color === 'success' ? 'bg-emerald-500' :
        color === 'warning' ? 'bg-amber-500' :
        color === 'danger' ? 'bg-red-500' : 'bg-blue-500'
      }`} />
      
      <div className="relative">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
          <Icon size={24} />
        </div>
        
        <p className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">
          {label}
        </p>
        
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-surface-900 dark:text-white">
            {value}
          </span>
          
          {trend && (
            <span className={`text-sm font-semibold mb-1 ${
              trendDirection === 'up' 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {trendDirection === 'up' ? '↑' : '↓'} {trend}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};