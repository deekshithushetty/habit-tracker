const User = require('../models/User');
const Habit = require('../models/Habit');
const Completion = require('../models/Completion');

// ==========================================
// PUT /api/auth/preferences
// Update user preferences
// ==========================================
const updatePreferences = async (req, res, next) => {
  try {
    const { showQuotes, weekStartsOn } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    // Update only provided fields
    if (typeof showQuotes === 'boolean') {
      user.preferences.showQuotes = showQuotes;
    }
    if (typeof weekStartsOn === 'number' && [0, 1].includes(weekStartsOn)) {
      user.preferences.weekStartsOn = weekStartsOn;
    }

    await user.save();

    res.json({
      preferences: user.preferences
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// PUT /api/auth/password
// Change user password
// ==========================================
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: { message: 'Current password and new password are required' }
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: { message: 'New password must be at least 6 characters' }
      });
    }

    // Get user with password field
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        error: { message: 'Current password is incorrect' }
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// DELETE /api/auth/account
// Delete user account and all data
// ==========================================
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Delete all completions for user's habits
    const habits = await Habit.find({ userId });
    const habitIds = habits.map(h => h._id);

    await Completion.deleteMany({ habitId: { $in: habitIds } });

    // Delete all habits
    await Habit.deleteMany({ userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    // Clear refresh token cookie
    res.clearCookie('refreshToken', { path: '/api/auth' });

    res.json({
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updatePreferences,
  changePassword,
  deleteAccount
};