import express from 'express';
import {
  markAttendance,
  getStudentAttendance,
  getLectureAttendance,
  getAttendanceReport,
  getLatestQR
} from '../controllers/attendanceController.js';
import { 
  authenticateToken, 
  authorizeRole 
} from '../middleware/auth.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Validation for attendance marking
const validateAttendanceMarking = [
  body('qrData')
    .notEmpty()
    .withMessage('QR data is required')
    .isLength({ min: 10 })
    .withMessage('Invalid QR data format'),
  handleValidationErrors
];

// @route   POST /api/attendance/mark
// @desc    Mark attendance by scanning QR code
// @access  Private (Students only)
router.post('/mark', authorizeRole('student'), validateAttendanceMarking, markAttendance);

// @route   GET /api/attendance/student
// @desc    Get current student's attendance
// @access  Private (Students only)
router.get('/student', authorizeRole('student'), getStudentAttendance);

// @route   GET /api/attendance/student/:studentId
// @desc    Get specific student's attendance (for teachers)
// @access  Private (Teachers only)
router.get('/student/:studentId', authorizeRole('teacher'), getStudentAttendance);

// @route   GET /api/attendance/lecture/:lectureId
// @desc    Get attendance for a specific lecture
// @access  Private (Teachers only)
router.get('/lecture/:lectureId', authorizeRole('teacher'), getLectureAttendance);

// @route   GET /api/attendance/report
// @desc    Get attendance report for teacher
// @access  Private (Teachers only)
router.get('/report', authorizeRole('teacher'), getAttendanceReport);

// @route   GET /api/attendance/qr/:sessionId
// @desc    Get latest QR code for session
// @access  Private (Students only)
router.get('/qr/:sessionId', authorizeRole('student'), getLatestQR);

export default router;
