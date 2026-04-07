export const Toggle = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = ''
}) => {
  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className={`
          w-11 h-6 rounded-full
          peer-focus:ring-2 peer-focus:ring-primary-500
          transition-colors duration-200
          ${checked
            ? 'bg-primary-600'
            : 'bg-gray-300 dark:bg-gray-600'
          }
        `}></div>
        <div className={`
          absolute left-1 top-1 w-4 h-4 bg-white rounded-full
          transition-transform duration-200
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}></div>
      </div>
      {label && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
    </label>
  );
};