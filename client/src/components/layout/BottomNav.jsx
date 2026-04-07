import { NavLink, useLocation } from 'react-router-dom';
import { Home, CheckSquare, BarChart3, User } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/tasks', icon: CheckSquare, label: 'Habits' },
  { to: '/insights', icon: BarChart3, label: 'Insights' },
  { to: '/profile', icon: User, label: 'Profile' }
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      {/* Glass background */}
      <div className="mx-4 mb-4 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl rounded-2xl shadow-elevated border border-surface-200/50 dark:border-surface-700/50">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to ||
              (to !== '/' && location.pathname.startsWith(to));

            return (
              <NavLink
                key={to}
                to={to}
                className={`
                  relative flex flex-col items-center justify-center
                  w-16 h-14 rounded-xl
                  transition-all duration-300 ease-out
                  ${isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300'}
                `}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute inset-0 bg-primary-100 dark:bg-primary-900/40 rounded-xl animate-scale-in" />
                )}
                
                {/* Icon container */}
                <div className={`
                  relative z-10 transition-transform duration-300
                  ${isActive ? 'scale-110' : ''}
                `}>
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                
                {/* Label */}
                <span className={`
                  relative z-10 text-[10px] font-semibold mt-1
                  transition-all duration-300
                  ${isActive ? 'opacity-100' : 'opacity-70'}
                `}>
                  {label}
                </span>

                {/* Active dot indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-primary-500 rounded-full animate-scale-in" />
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};