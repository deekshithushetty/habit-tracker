const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth.routes');
const habitRoutes = require('./routes/habit.routes');
const completionRoutes = require('./routes/completion.routes');
const insightRoutes = require('./routes/insight.routes');

const app = express();

// --- CORS Configuration for Production ---
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(null, true); // Allow all in development, restrict in production if needed
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Core Middleware ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Trust Proxy (for secure cookies behind reverse proxy) ---
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/completions', completionRoutes);
app.use('/api/insights', insightRoutes);

// --- 404 Handler for API ---
app.use(/^\/api\/.*/, (req, res) => {
  res.status(404).json({
    error: { message: `Route not found: ${req.method} ${req.originalUrl}` }
  });
});

// --- Serve Frontend in Production ---
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  
  app.use(express.static(clientBuildPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// --- Global Error Handler ---
app.use(errorHandler);

module.exports = app;