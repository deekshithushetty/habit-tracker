import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Home, Tasks, Insights, Profile, Login, Register } from '@/pages';
import { PageSpinner } from '@/components/ui';
import { InstallBanner, OfflineIndicator, UpdatePrompt } from '@/components/pwa';
import { Debug } from '@/pages/Debug'; // Add this

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/debug" element={<Debug />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="insights" element={<Insights />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {/* PWA Components */}
          <OfflineIndicator />
          <UpdatePrompt />
          
          {/* App Routes */}
          <AppRoutes />
          
          {/* Install Banner */}
          <InstallBanner />
          
          {/* Toast Notifications */}
          <Toaster
            position="top-center"
            toastOptions={{
              classNames: {
                toast: 'dark:bg-gray-800 dark:text-white dark:border-gray-700',
                success: 'dark:bg-green-900 dark:text-green-100',
                error: 'dark:bg-red-900 dark:text-red-100'
              }
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;