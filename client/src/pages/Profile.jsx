import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui';
import {
  StatsSummary,
  ThemeSelector,
  PreferencesCard,
  DataExport,
  AccountActions
} from '@/components/profile';
import { format } from 'date-fns';
import { Mail, Calendar } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const userName = user?.name?.trim() || 'User';
  const avatarInitial = userName.charAt(0).toUpperCase() || 'U';

  const memberSince = user?.createdAt
    ? format(new Date(user.createdAt), 'MMMM yyyy')
    : 'Unknown';

  return (
    <div className="px-4 pt-12 pb-6 space-y-4">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account settings
        </p>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-bold text-white">
              {avatarInitial}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {userName}
            </h2>
            <div className="flex items-center gap-1.5 mt-1 text-gray-500 dark:text-gray-400">
              <Mail size={14} />
              <span className="text-sm truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-gray-500 dark:text-gray-400">
              <Calendar size={14} />
              <span className="text-sm">Member since {memberSince}</span>
            </div>
          </div>
        </div>
      </Card>

      <StatsSummary />
      <ThemeSelector />
      <PreferencesCard />
      <DataExport />
      <AccountActions />

      <div className="text-center py-6 text-sm text-gray-400 dark:text-gray-500">
        <p>Habit Tracker v1.0.0</p>
        <p className="mt-1">Made with ❤️ for building better habits</p>
      </div>
    </div>
  );
};
