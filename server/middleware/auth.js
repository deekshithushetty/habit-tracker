const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: { message: 'Not authorized — no token provided' }
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: { message: 'Token expired', code: 'TOKEN_EXPIRED' }
        });
      }
      return res.status(401).json({
        error: { message: 'Invalid token' }
      });
    }

    // 3. Find user — make sure they still exist
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        error: { message: 'User no longer exists' }
      });
    }

    // 4. Attach user to request object
    req.user = {
      _id: user._id,
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = protect;