import { Card, Button } from '@/components/ui';
import { usePWA } from '@/hooks';
import { Download, Smartphone, Check } from 'lucide-react';

export const PWAInstallCard = () => {
  const { isInstallable, isInstalled, install } = usePWA();

  // Check if iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isInStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const showIOSInstructions = isIOS && !isInStandalone && !isInstalled;

  if (isInstalled || isInStandalone) {
    return (
      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
            <Check size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-medium text-green-800 dark:text-green-200">
              App Installed
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              You're using the installed app
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Smartphone size={18} className="text-gray-500 dark:text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Install App
        </h3>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Install Habit Tracker on your device for quick access and offline use.
      </p>

      {showIOSInstructions ? (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            <strong>To install on iOS:</strong>
          </p>
          <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-600">1</span>
              Tap the Share button
              <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L11 6.414V13a1 1 0 11-2 0V6.414L7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z"/>
                <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
              </svg>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-600">2</span>
              Scroll and tap "Add to Home Screen"
            </li>
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-600">3</span>
              Tap "Add" to confirm
            </li>
          </ol>
        </div>
      ) : isInstallable ? (
        <Button onClick={install} className="w-full">
          <Download size={18} />
          Install App
        </Button>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
          Open in Chrome or Safari to install
        </p>
      )}
    </Card>
  );
};