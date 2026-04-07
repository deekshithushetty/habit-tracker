import { Card } from '@/components/ui';
import { useTheme } from '@/hooks';
import { Sun, Moon, Monitor } from 'lucide-react';

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' }
  ];

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        Theme
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {themes.map(({ value, icon: Icon, label }) => {
          const isSelected = theme === value;
          return (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`
                flex flex-col items-center gap-2 p-4 rounded-xl
                transition-all duration-200
                ${isSelected
                  ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              <Icon
                size={24}
                className={isSelected
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400'
                }
              />
              <span className={`text-sm font-medium ${
                isSelected
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};