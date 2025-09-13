import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
  // Lecture Details
  lectureNumber: {
    type: String,
    required: [true, 'Lecture number is required'],
    trim: true
  },
  
  lectureName: {
    type: String,
    required: [true, 'Lecture name is required'],
    trim: true,
    maxLength: [100, 'Lecture name cannot exceed 100 characters']
  },
  
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  
  // Class Information
  class: {
    type: String,
    required: [true, 'Class is required'],
    trim: true
  },
  
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true
  },
  
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  
  // Teacher Information
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher ID is required']
  },
  
  teacherName: {
    type: String,
    required: [true, 'Teacher name is required'],
    trim: true
  },
  
  // Lecture Timing
  date: {
    type: Date,
    required: [true, 'Lecture date is required'],
    default: Date.now
  },
  
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  
  // Lecture Status
  status: {
    type: String,
    enum: ['scheduled', 'active', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  
  // QR Session Active
  qrSessionActive: {
    type: Boolean,
    default: false
  },
  
  qrSessionStartTime: {
    type: Date,
    default: null
  },
  
  qrSessionEndTime: {
    type: Date,
    default: null
  },
  
  // Attendance Summary
  totalStudents: {
    type: Number,
    default: 0
  },
  
  presentStudents: {
    type: Number,
    default: 0
  },
  
  absentStudents: {
    type: Number,
    default: 0
  }
  
}, {
  timestamps: true
});

// Create compound index for better queries
lectureSchema.index({ class: 1, section: 1, date: 1 });
lectureSchema.index({ teacherId: 1, date: 1 });

// Virtual for attendance percentage
lectureSchema.virtual('attendancePercentage').get(function() {
  if (this.totalStudents === 0) return 0;
  return Math.round((this.presentStudents / this.totalStudents) * 100);
});

export default mongoose.model('Lecture', lectureSchema);
