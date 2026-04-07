import { registerSW } from 'virtual:pwa-register';

export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    const updateSW = registerSW({
      onNeedRefresh() {
        // New content available, show update prompt
        if (confirm('New version available! Reload to update?')) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        console.log('App ready for offline use');
      },
      onRegistered(registration) {
        console.log('Service Worker registered:', registration);
      },
      onRegisterError(error) {
        console.error('Service Worker registration failed:', error);
      }
    });
  }
};