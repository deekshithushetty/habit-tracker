import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />
      </div>
      
      {/* Main content area */}
      <main className="relative pb-28 max-w-lg mx-auto">
        <Outlet />
      </main>

      {/* Fixed bottom navigation */}
      <BottomNav />
    </div>
  );
};