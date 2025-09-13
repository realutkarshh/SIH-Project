import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser
} from '../controllers/authController.js';
import { 
  validateUserRegistration,
  validateUserLogin
} from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', validateUserRegistration, registerUser);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateUserLogin, loginUser);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticateToken, getUserProfile);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticateToken, logoutUser);

export default router;
