const { z } = require('zod');

const toggleSchema = z.object({
  habitId: z
    .string({ required_error: 'Habit ID is required' })
    .min(1, 'Habit ID is required'),

  date: z
    .string({ required_error: 'Date is required' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
});

module.exports = {
  toggleSchema
};