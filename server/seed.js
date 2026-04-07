require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Habit = require('./models/Habit');
const Completion = require('./models/Completion');

const seed = async () => {
  await connectDB();
  console.log('\n🌱 Starting seed...\n');

  // ---- Clean existing data ----
  await User.deleteMany({});
  await Habit.deleteMany({});
  await Completion.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // ---- Create user ----
  const user = await User.create({
    email: 'alex@example.com',
    password: 'password123',
    name: 'Alex Johnson',
    preferences: {
      theme: 'dark',
      weekStartsOn: 1,
      showQuotes: true
    }
  });
  console.log(`👤 Created user: ${user.email}`);

  // Verify password hashing works
  const passwordMatch = await user.comparePassword('password123');
  const passwordFail = await user.comparePassword('wrongpassword');
  console.log(`🔐 Password hash verify (correct): ${passwordMatch}`);   // true
  console.log(`🔐 Password hash verify (wrong):   ${passwordFail}`);     // false

  // Verify JWT generation works
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  console.log(`🎟️  Access token generated:  ${accessToken.substring(0, 30)}...`);
  console.log(`🎟️  Refresh token generated: ${refreshToken.substring(0, 30)}...`);

  // ---- Create habits ----
  const habits = await Habit.insertMany([
    {
      userId: user._id,
      name: 'Morning Meditation',
      emoji: '🧘',
      color: '#8b5cf6',
      category: 'mind',
      frequency: { type: 'daily', days: [], timesPerWeek: null },
      currentStreak: 15,
      longestStreak: 30,
      totalCompletions: 45,
      sortOrder: 0
    },
    {
      userId: user._id,
      name: 'Exercise',
      emoji: '🏃',
      color: '#10b981',
      category: 'health',
      frequency: {
        type: 'specific_days',
        days: [1, 2, 3, 4, 5], // Monday to Friday
        timesPerWeek: null
      },
      currentStreak: 8,
      longestStreak: 22,
      totalCompletions: 60,
      sortOrder: 1
    },
    {
      userId: user._id,
      name: 'Read 30 Minutes',
      emoji: '📖',
      color: '#3b82f6',
      category: 'learning',
      frequency: { type: 'daily', days: [], timesPerWeek: null },
      currentStreak: 22,
      longestStreak: 22,
      totalCompletions: 22,
      sortOrder: 2
    },
    {
      userId: user._id,
      name: 'Drink 8 Glasses Water',
      emoji: '💧',
      color: '#06b6d4',
      category: 'health',
      frequency: { type: 'daily', days: [], timesPerWeek: null },
      currentStreak: 30,
      longestStreak: 45,
      totalCompletions: 90,
      sortOrder: 3
    },
    {
      userId: user._id,
      name: 'Practice Guitar',
      emoji: '🎸',
      color: '#f59e0b',
      category: 'learning',
      frequency: {
        type: 'x_per_week',
        days: [],
        timesPerWeek: 3
      },
      currentStreak: 3,
      longestStreak: 10,
      totalCompletions: 15,
      sortOrder: 4
    },
    {
      userId: user._id,
      name: 'Journal',
      emoji: '✍️',
      color: '#ec4899',
      category: 'mind',
      frequency: {
        type: 'specific_days',
        days: [1, 3, 5], // Mon, Wed, Fri
        timesPerWeek: null
      },
      currentStreak: 5,
      longestStreak: 14,
      totalCompletions: 28,
      sortOrder: 5
    },
    {
      userId: user._id,
      name: 'Take Vitamins',
      emoji: '💊',
      color: '#10b981',
      category: 'health',
      frequency: { type: 'daily', days: [], timesPerWeek: null },
      currentStreak: 12,
      longestStreak: 60,
      totalCompletions: 120,
      sortOrder: 6
    },
    {
      userId: user._id,
      name: 'No Social Media Before Noon',
      emoji: '📵',
      color: '#6b7280',
      category: 'productivity',
      frequency: { type: 'daily', days: [], timesPerWeek: null },
      currentStreak: 0,
      longestStreak: 7,
      totalCompletions: 18,
      sortOrder: 7
    }
  ]);
  console.log(`\n📝 Created ${habits.length} habits:`);
  habits.forEach(h => console.log(`   ${h.emoji}  ${h.name} (${h.category})`));

  // ---- Create completions for last 14 days ----
  const completions = [];
  const today = new Date();

  for (let daysAgo = 0; daysAgo < 14; daysAgo++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

    for (const habit of habits) {
      // Check if habit is scheduled for this day
      if (!habit.isScheduledForDay(dayOfWeek)) continue;

      // Simulate ~75% completion rate, today only ~50% done
      const completionChance = daysAgo === 0 ? 0.5 : 0.75;
      if (Math.random() < completionChance) {
        completions.push({
          habitId: habit._id,
          userId: user._id,
          date: dateStr,
          completed: true
        });
      }
    }
  }

  await Completion.insertMany(completions);
  console.log(`\n✅ Created ${completions.length} completions over 14 days`);

  // ---- Verify queries work ----
  const todayStr = today.toISOString().split('T')[0];

  const todayCompletions = await Completion.getByDate(user._id, todayStr);
  console.log(`\n📊 Query tests:`);
  console.log(`   Today's completions: ${todayCompletions.length}`);

  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const twoWeeksAgoStr = twoWeeksAgo.toISOString().split('T')[0];

  const meditationHistory = await Completion.getHabitHistory(
    habits[0]._id,
    twoWeeksAgoStr,
    todayStr
  );
  console.log(`   Meditation completions (14d): ${meditationHistory.length}`);

  const allHistory = await Completion.getUserHistory(
    user._id,
    twoWeeksAgoStr,
    todayStr
  );
  console.log(`   All user completions (14d): ${allHistory.length}`);

  // ---- Verify unique index prevents duplicates ----
  console.log(`\n🔒 Testing duplicate prevention...`);
  try {
    await Completion.create({
      habitId: habits[0]._id,
      userId: user._id,
      date: todayStr
    });
    // Try duplicate
    await Completion.create({
      habitId: habits[0]._id,
      userId: user._id,
      date: todayStr
    });
    console.log('   ❌ Duplicate was allowed (should not happen)');
  } catch (error) {
    if (error.code === 11000) {
      console.log('   ✅ Duplicate correctly prevented by unique index');
    } else {
      console.log(`   ⚠️  Unexpected error: ${error.message}`);
    }
  }

  // ---- Verify toggle works ----
  console.log(`\n🔄 Testing toggle...`);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Clean the test date for this habit first
  await Completion.deleteMany({ habitId: habits[1]._id, date: yesterdayStr });

  const result1 = await Completion.toggle(user._id, habits[1]._id, yesterdayStr);
  console.log(`   Toggle 1: ${result1.action}`); // completed

  const result2 = await Completion.toggle(user._id, habits[1]._id, yesterdayStr);
  console.log(`   Toggle 2: ${result2.action}`); // uncompleted

  const result3 = await Completion.toggle(user._id, habits[1]._id, yesterdayStr);
  console.log(`   Toggle 3: ${result3.action}`); // completed again

  // ---- Done ----
  console.log(`\n🎉 Seed complete!\n`);
  console.log('   Login credentials:');
  console.log('   📧 Email:    alex@example.com');
  console.log('   🔑 Password: password123\n');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});