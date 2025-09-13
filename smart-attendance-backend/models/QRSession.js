import mongoose from 'mongoose';

const qrSessionSchema = new mongoose.Schema({
  // Session Information
  sessionId: {
    type: String,
    required: [true, 'Session ID is required'],
    unique: true
  },
  
  // Lecture Reference
  lectureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture',
    required: [true, 'Lecture ID is required']
  },
  
  // QR Data
  qrData: {
    type: String,
    required: [true, 'QR data is required']
  },
  
  // Session Timing
  startTime: {
    type: Date,
    required: [true, 'Start time is required'],
    default: Date.now
  },
  
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  
  // Session Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Current QR Token (changes every 6 seconds)
  currentToken: {
    type: String,
    required: [true, 'Current token is required']
  },
  
  tokenGeneratedAt: {
    type: Date,
    default: Date.now
  },
  
  // Security
  maxScans: {
    type: Number,
    default: 1 // Each student can scan only once
  },
  
  scannedBy: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    scannedAt: {
      type: Date,
      default: Date.now
    }
  }]
  
}, {
  timestamps: true
});

// Index for efficient queries
qrSessionSchema.index({ sessionId: 1 });
qrSessionSchema.index({ lectureId: 1 });
qrSessionSchema.index({ endTime: 1 });

// Auto-delete expired sessions after 2 hours
qrSessionSchema.index({ endTime: 1 }, { expireAfterSeconds: 7200 });

export default mongoose.model('QRSession', qrSessionSchema);
