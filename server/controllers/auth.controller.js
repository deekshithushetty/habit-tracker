const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Cookie options for refresh token
const getRefreshCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-origin in production
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    ...(isProduction && { domain: process.env.COOKIE_DOMAIN }) // Optional: set domain
  };
};

// ==========================================
// POST /api/auth/register
// ==========================================
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: { message: 'An account with that email already exists' }
      });
    }

    const user = await User.create({ name, email, password });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

    res.status(201).json({
      user: user.toSafeObject(),
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// POST /api/auth/login
// ==========================================
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        error: { message: 'Invalid email or password' }
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        error: { message: 'Invalid email or password' }
      });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    if (user.refreshTokens.length >= 5) {
      user.refreshTokens.shift();
    }
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

    res.json({
      user: user.toSafeObject(),
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// POST /api/auth/refresh
// ==========================================
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        error: { message: 'No refresh token provided', code: 'NO_REFRESH_TOKEN' }
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      res.clearCookie('refreshToken', { path: '/api/auth' });
      return res.status(401).json({
        error: { message: 'Invalid or expired refresh token', code: 'INVALID_REFRESH_TOKEN' }
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      res.clearCookie('refreshToken', { path: '/api/auth' });
      return res.status(401).json({
        error: { message: 'User not found' }
      });
    }

    const tokenExists = user.refreshTokens.some(t => t.token === refreshToken);

    if (!tokenExists) {
      user.refreshTokens = [];
      await user.save();
      res.clearCookie('refreshToken', { path: '/api/auth' });

      return res.status(401).json({
        error: { message: 'Token reuse detected — logged out of all devices', code: 'TOKEN_REUSE' }
      });
    }

    user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    res.cookie('refreshToken', newRefreshToken, getRefreshCookieOptions());

    res.json({
      accessToken: newAccessToken
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// POST /api/auth/logout
// ==========================================
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);

        if (user) {
          user.refreshTokens = user.refreshTokens.filter(
            t => t.token !== refreshToken
          );
          await user.save();
        }
      } catch (err) {
        // Token invalid/expired — that's fine
      }
    }

    res.clearCookie('refreshToken', { path: '/api/auth' });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET /api/auth/me
// ==========================================
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    res.json({ user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe
};