import { useState } from 'react';
import { Card, Button, Input, BottomSheet, ConfirmDialog } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api';
import { toast } from 'sonner';
import { LogOut, Trash2, Key } from 'lucide-react';

export const AccountActions = () => {
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Change password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await api.delete('/auth/account');
      toast.success('Account deleted');
      await logout();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to delete account');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/password', {
        currentPassword,
        newPassword
      });
      toast.success('Password changed successfully');
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordError(error.response?.data?.error?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Account
        </h3>

        <div className="space-y-3">
          {/* Change Password */}
          <button
            onClick={() => setShowChangePassword(true)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Key size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Change Password
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update your account password
              </p>
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <LogOut size={18} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Log Out
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sign out of your account
              </p>
            </div>
          </button>

          {/* Delete Account */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
              <Trash2 size={18} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="font-medium text-red-600 dark:text-red-400">
                Delete Account
              </p>
              <p className="text-sm text-red-500/70 dark:text-red-400/70">
                Permanently delete your account and data
              </p>
            </div>
          </button>
        </div>
      </Card>

      {/* Logout Confirmation */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Log Out"
        message="Are you sure you want to log out?"
        confirmText="Log Out"
        confirmVariant="primary"
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? All your habits and completion history will be permanently deleted. This action cannot be undone."
        confirmText="Delete Forever"
        confirmVariant="danger"
        isLoading={loading}
      />

      {/* Change Password Modal */}
      <BottomSheet
        isOpen={showChangePassword}
        onClose={() => {
          setShowChangePassword(false);
          setPasswordError('');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }}
        title="Change Password"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          {passwordError && (
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
              {passwordError}
            </div>
          )}

          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowChangePassword(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              loading={loading}
              disabled={loading}
            >
              Update Password
            </Button>
          </div>
        </form>
      </BottomSheet>
    </>
  );
};