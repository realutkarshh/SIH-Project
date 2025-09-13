import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// Verify JWT Token
export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[22]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not found or inactive.'
      });
    }

    // Attach user to request object
    req.user = user;
    next();
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Verify user role
export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please authenticate first.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role}s are not allowed to access this resource.`
      });
    }

    next();
  };
};

// Check if user belongs to specific class/section (for students)
export const authorizeClassAccess = (req, res, next) => {
  try {
    const { class: reqClass, section: reqSection } = req.body;
    const user = req.user;

    // Teachers can access any class
    if (user.role === 'teacher') {
      return next();
    }

    // Students can only access their own class/section
    if (user.role === 'student') {
      if (user.class !== reqClass || user.section !== reqSection) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own class/section.'
        });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization error',
      error: error.message
    });
  }
};
