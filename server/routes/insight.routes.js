const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  getOverview,
  getStreaks,
  getDailyTrend,
  getBestWorstDays,
  getHabitInsight,
  getComparison
} = require('../controllers/insight.controller');

// All insight routes require authentication
router.use(protect);

// Overview stats for a time period
router.get('/overview', getOverview);

// Streak leaderboard
router.get('/streaks', getStreaks);

// Daily completion trend
router.get('/daily-trend', getDailyTrend);

// Best and worst days of the week
router.get('/best-worst-days', getBestWorstDays);

// Compare two time periods
router.get('/comparison', getComparison);

// Per-habit detailed analytics
router.get('/habit/:habitId', getHabitInsight);

module.exports = router;