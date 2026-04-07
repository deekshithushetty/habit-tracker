const mongoose = require('mongoose');

const completionSchema = new mongoose.Schema(
  {
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: String, // ISO date string "YYYY-MM-DD" — avoids timezone issues
      required: [true, 'Date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format']
    },
    completed: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // completedAt is effectively createdAt
  }
);

// --- Indexes ---
// CRITICAL: prevent duplicate completions for same habit on same day
completionSchema.index({ habitId: 1, date: 1 }, { unique: true });

// Home page: get all completions for a user on a specific date
completionSchema.index({ userId: 1, date: 1 });

// Insights: get completion history for a habit within a date range
completionSchema.index({ habitId: 1, date: -1 });

// Insights: get all completions for a user within a date range
completionSchema.index({ userId: 1, date: -1 });

// Clean lookup: specific user + habit + date
completionSchema.index({ userId: 1, habitId: 1, date: 1 });

// --- Static method: toggle a completion ---
completionSchema.statics.toggle = async function (userId, habitId, date) {
  const existing = await this.findOne({ habitId, date });

  if (existing) {
    // Completion exists — remove it (un-complete)
    await this.deleteOne({ _id: existing._id });
    return { action: 'uncompleted', completion: null };
  } else {
    // No completion — create it
    const completion = await this.create({ habitId, userId, date });
    return { action: 'completed', completion };
  }
};

// --- Static method: get completions for a date ---
completionSchema.statics.getByDate = function (userId, date) {
  return this.find({ userId, date }).lean();
};

// --- Static method: get completions for a habit in a range ---
completionSchema.statics.getHabitHistory = function (habitId, startDate, endDate) {
  return this.find({
    habitId,
    date: { $gte: startDate, $lte: endDate }
  })
    .sort({ date: 1 })
    .lean();
};

// --- Static method: get all user completions in a range ---
completionSchema.statics.getUserHistory = function (userId, startDate, endDate) {
  return this.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  })
    .sort({ date: 1 })
    .lean();
};

const Completion = mongoose.model('Completion', completionSchema);

module.exports = Completion;