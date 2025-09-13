import { generateNewToken, stopQRSession } from '../utils/qrGenerator.js';
import { QRSession, Lecture } from '../models/index.js';

// @desc    Refresh QR token (called every 6 seconds)
// @route   POST /api/qr/refresh/:sessionId
// @access  Private (Teachers only)
export const refreshQRToken = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const newQRData = await generateNewToken(sessionId);

    res.json({
      success: true,
      message: 'QR token refreshed successfully',
      data: newQRData
    });

  } catch (error) {
    console.error('Refresh QR token error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Stop QR session
// @route   POST /api/qr/stop/:sessionId
// @access  Private (Teachers only)
export const stopQR = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Verify teacher owns this session
    const session = await QRSession.findOne({ sessionId }).populate('lectureId');
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'QR session not found'
      });
    }

    if (session.lectureId.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await stopQRSession(sessionId);

    res.json({
      success: true,
      message: 'QR session stopped successfully'
    });

  } catch (error) {
    console.error('Stop QR session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error stopping QR session'
    });
  }
};

// @desc    Get QR session status
// @route   GET /api/qr/status/:sessionId
// @access  Private (Teachers only)
export const getQRStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await QRSession.findOne({ sessionId })
      .populate('lectureId', 'lectureName class section');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'QR session not found'
      });
    }

    const now = new Date();
    const timeRemaining = Math.max(0, session.endTime - now);
    const tokenAge = now - session.tokenGeneratedAt;

    res.json({
      success: true,
      data: {
        sessionId: session.sessionId,
        isActive: session.isActive && now < session.endTime,
        startTime: session.startTime,
        endTime: session.endTime,
        timeRemaining,
        currentToken: session.currentToken,
        tokenGeneratedAt: session.tokenGeneratedAt,
        tokenAge,
        needsRefresh: tokenAge > 6000, // 6 seconds
        scannedCount: session.scannedBy.length,
        lecture: session.lectureId
      }
    });

  } catch (error) {
    console.error('Get QR status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching QR status'
    });
  }
};
