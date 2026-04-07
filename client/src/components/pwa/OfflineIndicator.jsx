import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-50 py-2 px-4 text-center text-sm font-medium
        transition-all duration-300
        ${isOnline
          ? 'bg-green-500 text-white'
          : 'bg-orange-500 text-white'
        }
      `}
    >
      <div className="flex items-center justify-center gap-2 max-w-lg mx-auto">
        {isOnline ? (
          <>
            <Wifi size={16} />
            <span>Back online</span>
          </>
        ) : (
          <>
            <WifiOff size={16} />
            <span>You're offline — changes will sync when reconnected</span>
          </>
        )}
      </div>
    </div>
  );
};