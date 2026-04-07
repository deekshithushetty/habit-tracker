import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Card } from '@/components/ui';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Logo & Header */}
          <div className="text-center mb-10 animate-slide-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-600 to-purple-600 mb-6 shadow-elevated">
              <span className="text-4xl">🔥</span>
            </div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
              Welcome back
            </h1>
            <p className="text-surface-500 dark:text-surface-400">
              Sign in to continue your streak
            </p>
          </div>

          {/* Form */}
          <Card padding="lg" className="shadow-elevated animate-slide-up stagger-1">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-medium animate-scale-in">
                  {error}
                </div>
              )}

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={loading}
                disabled={loading}
              >
                Sign In
                <ArrowRight size={18} />
              </Button>
            </form>
          </Card>

          {/* Register link */}
          <p className="text-center mt-8 text-surface-500 dark:text-surface-400 animate-slide-up stagger-2">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>

          {/* Demo credentials */}
          <Card 
            padding="sm" 
            className="mt-6 bg-surface-50 dark:bg-surface-800/50 border-dashed animate-slide-up stagger-3"
          >
            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 text-center mb-2">
              Demo Account
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <code className="px-2 py-1 bg-white dark:bg-surface-900 rounded-lg text-surface-700 dark:text-surface-300 font-mono">
                alex@example.com
              </code>
              <code className="px-2 py-1 bg-white dark:bg-surface-900 rounded-lg text-surface-700 dark:text-surface-300 font-mono">
                password123
              </code>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};