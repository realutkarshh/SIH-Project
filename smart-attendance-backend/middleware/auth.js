import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// Verify JWT Token
export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    console.log('🔍 Auth Header Value:', authHeader);
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authorization header provided.'
      });
    }

    // Check if header starts with Bearer
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid authorization format. Use: Bearer <token>'
      });
    }

    // Extract token - More robust extraction
    const token = authHeader.substring(7); // Remove "Bearer " (7 characters)
    console.log('🔍 Extracted Token:', token);
    console.log('🔍 Token Length:', token ? token.length : 'undefined');

    if (!token || token.trim() === '') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided after Bearer.'
      });
    }

    // Verify token
    console.log('🔍 JWT Secret exists:', !!process.env.JWT_SECRET);
    const decoded = jwt.verify(token.trim(), process.env.JWT_SECRET);
    console.log('🔍 Decoded Token:', decoded);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    console.log('🔍 Found User:', user ? user.name : 'Not found');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not found or inactive.'
      });
    }

    // Attach user to request object
    req.user = user;
    console.log('✅ Authentication successful for:', user.name);
    next();
    
  } catch (error) {
    console.error('🚫 Auth Error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token format.'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Token verification failed.',
      error: error.message
    });
  }
};

// Keep your other middleware functions unchanged...
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

export const authorizeClassAccess = (req, res, next) => {
  try {
    const { class: reqClass, section: reqSection } = req.body;
    const user = req.user;

    if (user.role === 'teacher') {
      return next();
    }

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
