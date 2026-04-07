import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui';
import { RefreshCw, X } from 'lucide-react';

export const UpdatePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered(registration) {
      console.log('SW registered:', registration);
    },
    onRegisterError(error) {
      console.log('SW registration error:', error);
    }
  });

  useEffect(() => {
    if (needRefresh) {
      setShowPrompt(true);
    }
  }, [needRefresh]);

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setNeedRefresh(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-lg mx-auto animate-slide-down">
      <div className="bg-primary-600 text-white rounded-2xl shadow-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <RefreshCw size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Update Available</h3>
            <p className="text-sm text-primary-100">
              A new version is ready to install
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-3">
          <Button
            onClick={handleUpdate}
            variant="secondary"
            className="w-full bg-white text-primary-600 hover:bg-primary-50"
          >
            <RefreshCw size={16} />
            Update Now
          </Button>
        </div>
      </div>
    </div>
  );
};