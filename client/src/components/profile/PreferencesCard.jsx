import { useState } from 'react';
import { Card, Toggle, Select, Button } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api';
import { toast } from 'sonner';
import { Settings } from 'lucide-react';

export const PreferencesCard = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const [showQuotes, setShowQuotes] = useState(user?.preferences?.showQuotes ?? true);
  const [weekStartsOn, setWeekStartsOn] = useState(user?.preferences?.weekStartsOn ?? 1);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update user preferences via API
      const response = await api.put('/auth/preferences', {
        showQuotes,
        weekStartsOn: parseInt(weekStartsOn)
      });

      updateUser({ preferences: response.data.preferences });
      toast.success('Preferences saved!');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const hasChanges =
    showQuotes !== (user?.preferences?.showQuotes ?? true) ||
    weekStartsOn !== (user?.preferences?.weekStartsOn ?? 1);

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Settings size={18} className="text-gray-500 dark:text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Preferences
        </h3>
      </div>

      <div className="space-y-6">
        {/* Show Quotes */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              Daily Quotes
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Show motivational quotes on home page
            </p>
          </div>
          <Toggle
            checked={showQuotes}
            onChange={setShowQuotes}
          />
        </div>

        {/* Week Starts On */}
        <div>
          <p className="font-medium text-gray-900 dark:text-white mb-1">
            Week Starts On
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Affects weekly charts and calendar
          </p>
          <Select
            value={weekStartsOn}
            onChange={(e) => setWeekStartsOn(parseInt(e.target.value))}
            options={[
              { value: 1, label: 'Monday' },
              { value: 0, label: 'Sunday' }
            ]}
          />
        </div>

        {/* Save Button */}
        {hasChanges && (
          <Button
            onClick={handleSave}
            loading={loading}
            className="w-full"
          >
            Save Preferences
          </Button>
        )}
      </div>
    </Card>
  );
};