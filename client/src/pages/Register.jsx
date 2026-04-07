import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Card } from '@/components/ui';
import { User, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Track unlimited habits',
    'Detailed insights & analytics',
    'Works offline',
    'Free forever'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Logo & Header */}
          <div className="text-center mb-10 animate-slide-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-600 to-purple-600 mb-6 shadow-elevated">
              <span className="text-4xl">🔥</span>
            </div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
              Start your journey
            </h1>
            <p className="text-surface-500 dark:text-surface-400">
              Build better habits, one day at a time
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-8 animate-slide-up stagger-1">
            <div className="flex flex-wrap justify-center gap-2">
              {benefits.map((benefit, i) => (
                <div 
                  key={benefit}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full"
                >
                  <CheckCircle size={12} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <Card padding="lg" className="shadow-elevated animate-slide-up stagger-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-medium animate-scale-in">
                  {error}
                </div>
              )}

              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={User}
                required
                autoComplete="name"
              />

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
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
                minLength={6}
                autoComplete="new-password"
                hint="Must be at least 6 characters"
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={loading}
                disabled={loading}
              >
                Create Account
                <ArrowRight size={18} />
              </Button>
            </form>
          </Card>

          {/* Login link */}
          <p className="text-center mt-8 text-surface-500 dark:text-surface-400 animate-slide-up stagger-3">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};