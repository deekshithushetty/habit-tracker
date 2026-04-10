const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Habit name is required'],
      trim: true,
      maxlength: [100, 'Habit name cannot exceed 100 characters']
    },
    emoji: {
      type: String,
      default: '✅'
    },
    color: {
      type: String,
      default: '#6366f1',
      match: [/^#([A-Fa-f0-9]{6})$/, 'Please enter a valid hex color']
    },
    category: {
      type: String,
      enum: ['health', 'mind', 'productivity', 'learning', 'social', 'custom'],
      default: 'custom'
    },
    frequency: {
      type: {
        type: String,
        enum: ['daily', 'specific_days', 'x_per_week'],
        default: 'daily'
      },
      days: {
        type: [Number], // 0=Sunday, 1=Monday, ..., 6=Saturday
        default: [],
        validate: {
          validator: function (arr) {
            return arr.every(d => d >= 0 && d <= 6);
          },
          message: 'Days must be between 0 (Sunday) and 6 (Saturday)'
        }
      },
      timesPerWeek: {
        type: Number,
        min: 1,
        max: 7,
        default: null
      }
    },
    reminderTime: {
      type: String,
      default: null,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:mm format']
    },
    startDate: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format']
    },

    // Denormalized streak data — updated on each completion toggle
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    totalCompletions: {
      type: Number,
      default: 0
    },

    isArchived: {
      type: Boolean,
      default: false
    },
    archivedAt: {
      type: Date,
      default: null
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// --- Indexes ---
// Tasks page: fetch all active habits for a user
habitSchema.index({ userId: 1, isArchived: 1 });
// Filtered views by category
habitSchema.index({ userId: 1, category: 1 });
// Sorting within user
habitSchema.index({ userId: 1, sortOrder: 1 });

// --- Virtual: check if habit is scheduled for a given day ---
habitSchema.methods.isScheduledForDay = function (dayOfWeek) {
  // dayOfWeek: 0=Sunday, 1=Monday, ..., 6=Saturday
  const freq = this.frequency;

  if (freq.type === 'daily') {
    return true;
  }

  if (freq.type === 'specific_days') {
    return freq.days.includes(dayOfWeek);
  }

  // x_per_week — always "scheduled" (user picks when)
  if (freq.type === 'x_per_week') {
    return true;
  }

  return false;
};

// --- Instance method: safe object for API response ---
habitSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;