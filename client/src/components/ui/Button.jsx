import { forwardRef } from 'react';

const variants = {
  primary: `
    bg-gradient-to-r from-primary-600 to-primary-500
    hover:from-primary-500 hover:to-primary-400
    text-white font-semibold
    shadow-lg shadow-primary-500/25
    hover:shadow-xl hover:shadow-primary-500/30
  `,
  secondary: `
    bg-white dark:bg-surface-800
    hover:bg-surface-50 dark:hover:bg-surface-700
    text-surface-700 dark:text-surface-200
    border border-surface-200 dark:border-surface-700
    shadow-soft
    hover:shadow-md
  `,
  ghost: `
    hover:bg-surface-100 dark:hover:bg-surface-800
    text-surface-600 dark:text-surface-400
    hover:text-surface-900 dark:hover:text-white
  `,
  danger: `
    bg-gradient-to-r from-danger to-red-500
    hover:from-red-500 hover:to-red-400
    text-white font-semibold
    shadow-lg shadow-danger/25
    hover:shadow-xl hover:shadow-danger/30
  `,
  success: `
    bg-gradient-to-r from-success to-emerald-400
    hover:from-emerald-400 hover:to-emerald-300
    text-white font-semibold
    shadow-lg shadow-success/25
  `,
  outline: `
    border-2 border-primary-500 dark:border-primary-400
    text-primary-600 dark:text-primary-400
    hover:bg-primary-50 dark:hover:bg-primary-950
    font-semibold
  `
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs rounded-lg gap-1',
  sm: 'px-3.5 py-2 text-sm rounded-xl gap-1.5',
  md: 'px-5 py-2.5 text-base rounded-xl gap-2',
  lg: 'px-6 py-3 text-lg rounded-2xl gap-2',
  xl: 'px-8 py-4 text-xl rounded-2xl gap-3',
  icon: 'p-2.5 rounded-xl',
  'icon-lg': 'p-3.5 rounded-2xl'
};

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  fullWidth = false,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center
        font-medium
        transition-all duration-200 ease-out
        press-effect
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin h-4 w-4 flex-shrink-0" 
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';