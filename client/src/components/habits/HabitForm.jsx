import { useState } from 'react';
import { Input, Select, Button } from '@/components/ui';
import { EmojiPicker } from './EmojiPicker';
import { ColorPicker } from './ColorPicker';
import { DaySelector } from './DaySelector';
import { CATEGORIES, FREQUENCY_TYPES } from '@/lib/constants';
import { getTodayStr } from '@/lib/dates';

const getInitialFormData = (initialData = null) => ({
  name: initialData?.name || '',
  emoji: initialData?.emoji || '✅',
  color: initialData?.color || '#6366f1',
  category: initialData?.category || 'custom',
  frequency: initialData?.frequency || {
    type: 'daily',
    days: [],
    timesPerWeek: null
  },
  reminderTime: initialData?.reminderTime || '',
  startDate: initialData?.startDate || getTodayStr()
});

export const HabitForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState(() => getInitialFormData(initialData));
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateFrequency = (field, value) => {
    setFormData(prev => ({
      ...prev,
      frequency: { ...prev.frequency, [field]: value }
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required';
    }

    if (formData.frequency.type === 'specific_days' && formData.frequency.days.length === 0) {
      newErrors.days = 'Please select at least one day';
    }

    if (formData.frequency.type === 'x_per_week' && (!formData.frequency.timesPerWeek || formData.frequency.timesPerWeek < 1)) {
      newErrors.timesPerWeek = 'Please set times per week';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const cleanedData = {
      ...formData,
      frequency: {
        type: formData.frequency.type,
        days: formData.frequency.type === 'specific_days' ? formData.frequency.days : [],
        timesPerWeek: formData.frequency.type === 'x_per_week' ? formData.frequency.timesPerWeek : null
      },
      reminderTime: formData.reminderTime || null,
      startDate: formData.startDate || getTodayStr()
    };

    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Habit Name"
        placeholder="e.g., Morning meditation"
        value={formData.name}
        onChange={(e) => updateField('name', e.target.value)}
        error={errors.name}
        maxLength={100}
      />

      <EmojiPicker
        selected={formData.emoji}
        onSelect={(emoji) => updateField('emoji', emoji)}
      />

      <ColorPicker
        selected={formData.color}
        onSelect={(color) => updateField('color', color)}
      />

      <Select
        label="Category"
        value={formData.category}
        onChange={(e) => updateField('category', e.target.value)}
        options={CATEGORIES.map(cat => ({
          value: cat.value,
          label: `${cat.emoji} ${cat.label}`
        }))}
      />

      <Select
        label="Frequency"
        value={formData.frequency.type}
        onChange={(e) => {
          updateFrequency('type', e.target.value);
          updateFrequency('days', []);
          updateFrequency('timesPerWeek', null);
        }}
        options={FREQUENCY_TYPES}
      />

      {formData.frequency.type === 'specific_days' && (
        <div>
          <DaySelector
            selectedDays={formData.frequency.days}
            onChange={(days) => updateFrequency('days', days)}
          />
          {errors.days && (
            <p className="mt-1.5 text-sm text-red-500">{errors.days}</p>
          )}
        </div>
      )}

      {formData.frequency.type === 'x_per_week' && (
        <Input
          label="Times per week"
          type="number"
          min="1"
          max="7"
          placeholder="3"
          value={formData.frequency.timesPerWeek || ''}
          onChange={(e) => updateFrequency('timesPerWeek', parseInt(e.target.value, 10) || null)}
          error={errors.timesPerWeek}
        />
      )}

      <Input
        label="Reminder Time (optional)"
        type="time"
        value={formData.reminderTime}
        onChange={(e) => updateField('reminderTime', e.target.value)}
      />

      <Input
        label="Start Date"
        type="date"
        value={formData.startDate}
        onChange={(e) => updateField('startDate', e.target.value)}
      />

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          loading={isLoading}
          disabled={isLoading}
        >
          {initialData ? 'Update Habit' : 'Create Habit'}
        </Button>
      </div>
    </form>
  );
};
