import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { QRSession } from '../models/index.js';

// Generate new QR token (refreshes every 6 seconds)
export const generateNewToken = async (sessionId) => {
  try {
    const session = await QRSession.findOne({ sessionId, isActive: true });
    
    if (!session) {
      throw new Error('Session not found or inactive');
    }

    // Check if session has expired
    if (new Date() > session.endTime) {
      await QRSession.findByIdAndUpdate(session._id, { isActive: false });
      throw new Error('Session expired');
    }

    // Generate new token
    const newToken = uuidv4();
    const timestamp = new Date();

    // Update QR data with new token
    const qrDataObj = JSON.parse(session.qrData);
    qrDataObj.token = newToken;
    qrDataObj.timestamp = timestamp.getTime();
    
    const newQrData = JSON.stringify(qrDataObj);

    // Generate new QR code
    const qrCodeDataURL = await QRCode.toDataURL(newQrData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 256
    });

    // Update session with new token
    await QRSession.findByIdAndUpdate(session._id, {
      currentToken: newToken,
      tokenGeneratedAt: timestamp,
      qrData: newQrData
    });

    return {
      sessionId,
      qrCodeDataURL,
      qrData: newQrData,
      token: newToken,
      timestamp: timestamp.getTime()
    };

  } catch (error) {
    console.error('Generate token error:', error);
    throw error;
  }
};

// Validate QR scan
export const validateQRScan = async (qrData, studentId) => {
  try {
    const scanData = JSON.parse(qrData);
    const { sessionId, token, timestamp } = scanData;

    // Find session
    const session = await QRSession.findOne({ sessionId, isActive: true });
    
    if (!session) {
      return {
        valid: false,
        message: 'Invalid or expired QR code'
      };
    }

    // Check if session is still active
    if (new Date() > session.endTime) {
      await QRSession.findByIdAndUpdate(session._id, { isActive: false });
      return {
        valid: false,
        message: 'QR session has expired'
      };
    }

    // Check token validity (should be generated within last 6 seconds)
    const tokenAge = Date.now() - new Date(session.tokenGeneratedAt).getTime();
    if (tokenAge > 6000) { // 6 seconds
      return {
        valid: false,
        message: 'QR code has expired, please scan the latest code'
      };
    }

    // Validate token
    if (session.currentToken !== token) {
      return {
        valid: false,
        message: 'Invalid QR code token'
      };
    }

    // Check if student already scanned
    const alreadyScanned = session.scannedBy.some(
      scan => scan.studentId.toString() === studentId.toString()
    );

    if (alreadyScanned) {
      return {
        valid: false,
        message: 'You have already marked attendance for this lecture'
      };
    }

    return {
      valid: true,
      session,
      message: 'QR code is valid'
    };

  } catch (error) {
    console.error('Validate QR scan error:', error);
    return {
      valid: false,
      message: 'Invalid QR code format'
    };
  }
};

// Stop QR session
export const stopQRSession = async (sessionId) => {
  try {
    const session = await QRSession.findOneAndUpdate(
      { sessionId },
      { isActive: false, endTime: new Date() },
      { new: true }
    );

    if (session) {
      // Update lecture status
      await Lecture.findByIdAndUpdate(session.lectureId, {
        qrSessionActive: false,
        status: 'completed'
      });
    }

    return session;
  } catch (error) {
    console.error('Stop QR session error:', error);
    throw error;
  }
};
