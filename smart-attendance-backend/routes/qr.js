import express from 'express';
import {
  refreshQRToken,
  stopQR,
  getQRStatus
} from '../controllers/qrController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// @route   POST /api/qr/refresh/:sessionId
// @desc    Refresh QR token
// @access  Private (Teachers only)
router.post('/refresh/:sessionId', authorizeRole('teacher'), refreshQRToken);

// @route   POST /api/qr/stop/:sessionId
// @desc    Stop QR session
// @access  Private (Teachers only)
router.post('/stop/:sessionId', authorizeRole('teacher'), stopQR);

// @route   GET /api/qr/status/:sessionId
// @desc    Get QR session status
// @access  Private (Teachers only)
router.get('/status/:sessionId', authorizeRole('teacher'), getQRStatus);

export default router;
