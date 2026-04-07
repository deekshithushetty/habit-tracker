import { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { useHabits } from '@/hooks';
import { completionsApi } from '@/api';
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { format as formatDate, subDays } from 'date-fns';

export const DataExport = () => {
  const [exporting, setExporting] = useState(false);
  const { data: habits } = useHabits();

  const exportData = async (fileFormat) => {
    setExporting(true);
    try {
      // Fetch completion history for all habits
      const today = new Date().toISOString().split('T')[0];
      const yearAgo = formatDate(subDays(new Date(), 365), 'yyyy-MM-dd');

      const completionsResponse = await completionsApi.getRange(yearAgo, today);

      const data = {
        exportDate: new Date().toISOString(),
        habits: habits || [],
        completions: completionsResponse.completionsByDate || {}
      };

      let content;
      let filename;
      let mimeType;

      if (fileFormat === 'json') {
        content = JSON.stringify(data, null, 2);
        filename = `habit-tracker-export-${today}.json`;
        mimeType = 'application/json';
      } else {
        // CSV format
        const rows = [['Date', 'Habit', 'Category', 'Completed']];

        Object.entries(data.completions).forEach(([date, habitIds]) => {
          habitIds.forEach(habitId => {
            const habit = habits?.find(h => h._id === habitId);
            if (habit) {
              rows.push([date, habit.name, habit.category, 'Yes']);
            }
          });
        });

        content = rows.map(row => row.join(',')).join('\n');
        filename = `habit-tracker-export-${today}.csv`;
        mimeType = 'text/csv';
      }

      // Download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Data exported as ${fileFormat.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Download size={18} className="text-gray-500 dark:text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Export Data
        </h3>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Download your habit data for backup or analysis
      </p>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={() => exportData('json')}
          disabled={exporting}
          className="flex-1"
        >
          <FileJson size={18} />
          JSON
        </Button>
        <Button
          variant="secondary"
          onClick={() => exportData('csv')}
          disabled={exporting}
          className="flex-1"
        >
          <FileSpreadsheet size={18} />
          CSV
        </Button>
      </div>
    </Card>
  );
};