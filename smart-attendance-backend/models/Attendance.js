import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  // Student Information
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  
  studentEmployeeId: {
    type: String,
    required: [true, 'Student employee ID is required']
  },
  
  // Lecture Information
  lectureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture',
    required: [true, 'Lecture ID is required']
  },
  
  lectureName: {
    type: String,
    required: [true, 'Lecture name is required']
  },
  
  // Class Information
  class: {
    type: String,
    required: [true, 'Class is required']
  },
  
  section: {
    type: String,
    required: [true, 'Section is required']
  },
  
  // Teacher Information
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher ID is required']
  },
  
  teacherName: {
    type: String,
    required: [true, 'Teacher name is required']
  },
  
  // Attendance Details
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    default: 'present'
  },
  
  markedAt: {
    type: Date,
    default: Date.now
  },
  
  markedBy: {
    type: String,
    default: 'QR_SCAN'
  },
  
  // Location/Device Info (optional)
  ipAddress: {
    type: String,
    default: null
  },
  
  userAgent: {
    type: String,
    default: null
  },
  
  // QR Session Info
  qrSessionId: {
    type: String,
    required: [true, 'QR session ID is required']
  }
  
}, {
  timestamps: true
});

// Compound indexes for efficient queries
attendanceSchema.index({ studentId: 1, lectureId: 1 }, { unique: true });
attendanceSchema.index({ class: 1, section: 1, markedAt: 1 });
attendanceSchema.index({ teacherId: 1, markedAt: 1 });

export default mongoose.model('Attendance', attendanceSchema);
