const { z } = require('zod');

const CATEGORIES = ['health', 'mind', 'productivity', 'learning', 'social', 'custom'];
const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6})$/;

const createHabitSchema = z.object({
  name: z
    .string({ required_error: 'Habit name is required' })
    .trim()
    .min(1, 'Habit name is required')
    .max(100, 'Habit name cannot exceed 100 characters'),

  emoji: z
    .string()
    .trim()
    .default('✅'),

  color: z
    .string()
    .regex(HEX_COLOR_REGEX, 'Color must be a valid hex code like #6366f1')
    .default('#6366f1'),

  category: z
    .enum(CATEGORIES, {
      errorMap: () => ({ message: `Category must be one of: ${CATEGORIES.join(', ')}` })
    })
    .default('custom'),

  frequency: z
    .object({
      type: z.enum(['daily', 'specific_days', 'x_per_week'], {
        errorMap: () => ({
          message: 'Frequency type must be daily, specific_days, or x_per_week'
        })
      }),
      days: z
        .array(z.number().int().min(0).max(6))
        .default([]),
      timesPerWeek: z
        .number()
        .int()
        .min(1)
        .max(7)
        .nullable()
        .default(null)
    })
    .default({ type: 'daily', days: [], timesPerWeek: null })
    .refine(
      (freq) => {
        // specific_days must have at least one day selected
        if (freq.type === 'specific_days') {
          return freq.days.length > 0;
        }
        return true;
      },
      { message: 'Please select at least one day for specific_days frequency' }
    )
    .refine(
      (freq) => {
        // x_per_week must have timesPerWeek set
        if (freq.type === 'x_per_week') {
          return freq.timesPerWeek !== null && freq.timesPerWeek >= 1;
        }
        return true;
      },
      { message: 'Please set times per week for x_per_week frequency' }
    ),

  reminderTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Reminder time must be in HH:mm format')
    .nullable()
    .default(null),

  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
    .optional()
});

const updateHabitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Habit name cannot be empty')
    .max(100, 'Habit name cannot exceed 100 characters')
    .optional(),

  emoji: z
    .string()
    .trim()
    .optional(),

  color: z
    .string()
    .regex(HEX_COLOR_REGEX, 'Color must be a valid hex code like #6366f1')
    .optional(),

  category: z
    .enum(CATEGORIES, {
      errorMap: () => ({ message: `Category must be one of: ${CATEGORIES.join(', ')}` })
    })
    .optional(),

  frequency: z
    .object({
      type: z.enum(['daily', 'specific_days', 'x_per_week']),
      days: z
        .array(z.number().int().min(0).max(6))
        .default([]),
      timesPerWeek: z
        .number()
        .int()
        .min(1)
        .max(7)
        .nullable()
        .default(null)
    })
    .refine(
      (freq) => {
        if (freq.type === 'specific_days') {
          return freq.days.length > 0;
        }
        return true;
      },
      { message: 'Please select at least one day for specific_days frequency' }
    )
    .refine(
      (freq) => {
        if (freq.type === 'x_per_week') {
          return freq.timesPerWeek !== null && freq.timesPerWeek >= 1;
        }
        return true;
      },
      { message: 'Please set times per week for x_per_week frequency' }
    )
    .optional(),

  reminderTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Reminder time must be in HH:mm format')
    .nullable()
    .optional(),

  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
    .optional()
});

const reorderSchema = z.object({
  habits: z
    .array(
      z.object({
        _id: z.string().min(1, 'Habit ID is required'),
        sortOrder: z.number().int().min(0)
      })
    )
    .min(1, 'At least one habit must be provided')
});

module.exports = {
  createHabitSchema,
  updateHabitSchema,
  reorderSchema
};