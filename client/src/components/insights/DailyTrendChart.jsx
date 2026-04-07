import { Card } from '@/components/ui';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { format, parseISO } from 'date-fns';

export const DailyTrendChart = ({
  data,
  isLoading,
  period = 'week'
}) => {
  if (isLoading) {
    return (
      <Card>
        <div className="h-48 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading chart...</div>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No data available
        </div>
      </Card>
    );
  }

  // Format data for the chart
  const chartData = data.map((item) => ({
    ...item,
    label: period === 'week'
      ? format(parseISO(item.date), 'EEE')
      : format(parseISO(item.date), 'MMM d'),
    fill: item.percentage >= 80
      ? '#10b981' // green
      : item.percentage >= 50
        ? '#f59e0b' // yellow
        : item.percentage > 0
          ? '#f97316' // orange
          : '#e5e7eb' // gray
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {format(parseISO(data.date), 'EEEE, MMM d')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {data.completed}/{data.scheduled} completed ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        Daily Completion
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
            <Bar
              dataKey="percentage"
              radius={[4, 4, 0, 0]}
              maxBarSize={period === 'week' ? 40 : 20}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};