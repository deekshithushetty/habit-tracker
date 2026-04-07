import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = forwardRef(({
  label,
  error,
  hint,
  icon: Icon,
  type = 'text',
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
            <Icon size={18} />
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={`
            w-full px-4 py-3.5
            ${Icon ? 'pl-11' : ''}
            ${isPassword ? 'pr-11' : ''}
            bg-surface-50 dark:bg-surface-800
            border-2 border-transparent
            ring-1 ring-surface-200 dark:ring-surface-700
            rounded-xl
            text-surface-900 dark:text-white
            placeholder-surface-400 dark:placeholder-surface-500
            transition-all duration-200
            hover:ring-surface-300 dark:hover:ring-surface-600
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-surface-900
            ${error ? 'ring-2 ring-danger focus:ring-danger' : ''}
            ${className}
          `}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      
      {hint && !error && (
        <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
          {hint}
        </p>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-danger font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';