import { useState, useEffect } from 'react';
import { usePWA } from '@/hooks';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui';

export const InstallBanner = () => {
  const { isInstallable, isInstalled, install } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    // Check if we've already dismissed
    const wasDismissed = localStorage.getItem('pwa-banner-dismissed');
    if (wasDismissed) {
      const dismissedAt = new Date(wasDismissed);
      const now = new Date();
      // Show again after 7 days
      if ((now - dismissedAt) < 7 * 24 * 60 * 60 * 1000) {
        setDismissed(true);
      }
    }

    // Check if iOS without install prompt
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isIOS && !isInStandalone && !isInstalled) {
      setShowIOSPrompt(true);
    }
  }, [isInstalled]);

  const handleDismiss = () => {
    setDismissed(true);
    setShowIOSPrompt(false);
    localStorage.setItem('pwa-banner-dismissed', new Date().toISOString());
  };

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      setDismissed(true);
    }
  };

  // Don't show if installed, dismissed, or not installable
  if (isInstalled || dismissed) return null;
  if (!isInstallable && !showIOSPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 max-w-lg mx-auto animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <Smartphone size={24} className="text-primary-600 dark:text-primary-400" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Install Habit Tracker
            </h3>
            
            {showIOSPrompt ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Tap <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L11 6.414V13a1 1 0 11-2 0V6.414L7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z"/>
                    <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                  </svg>
                </span> then <strong>"Add to Home Screen"</strong>
              </p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Add to your home screen for quick access
              </p>
            )}
          </div>

          {/* Dismiss */}
          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Install button (not for iOS) */}
        {isInstallable && !showIOSPrompt && (
          <div className="mt-4">
            <Button onClick={handleInstall} className="w-full">
              <Download size={18} />
              Install App
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};