import { useState } from 'react';
import { Check } from 'lucide-react';
import { useToggleCompletion } from '@/hooks';

export const HabitCheckbox = ({
  habitId,
  date,
  isCompleted,
  color = '#6366f1',
  disabled = false
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const toggleMutation = useToggleCompletion();

  const handleToggle = async () => {
    if (disabled || toggleMutation.isPending) return;

    setIsAnimating(true);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    toggleMutation.mutate({ habitId, date });
    
    setTimeout(() => setIsAnimating(false), 400);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={disabled || toggleMutation.isPending}
      className={`
        relative w-8 h-8 rounded-xl
        flex items-center justify-center
        transition-all duration-300 ease-out
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isCompleted ? 'scale-100' : 'hover:scale-105'}
      `}
      style={{
        backgroundColor: isCompleted ? color : 'transparent',
        border: `2px solid ${isCompleted ? color : '#e2e8f0'}`,
        boxShadow: isCompleted ? `0 4px 12px ${color}40` : 'none'
      }}
      aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
    >
      {/* Checkmark */}
      <Check
        size={18}
        strokeWidth={3}
        className={`
          text-white transition-all duration-300
          ${isCompleted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
          ${isAnimating && isCompleted ? 'animate-check-pop' : ''}
        `}
      />

      {/* Ripple effect */}
      {isAnimating && isCompleted && (
        <span
          className="absolute inset-0 rounded-xl animate-ping opacity-40"
          style={{ backgroundColor: color }}
        />
      )}

      {/* Success particles */}
      {isAnimating && isCompleted && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full animate-ping"
              style={{
                backgroundColor: color,
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 60}deg) translateX(20px)`,
                animationDelay: `${i * 0.05}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>
      )}
    </button>
  );
};