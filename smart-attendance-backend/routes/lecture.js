import express from 'express';
import {
  createLecture,
  getTeacherLectures,
  getStudentLectures,
  getLecture,
  updateLecture,
  deleteLecture,
  startQRSession
} from '../controllers/lectureController.js';
import { 
  authenticateToken, 
  authorizeRole 
} from '../middleware/auth.js';
import { validateLectureCreation } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// @route   POST /api/lectures
// @desc    Create new lecture
// @access  Private (Teachers only)
router.post('/', authorizeRole('teacher'), validateLectureCreation, createLecture);

// @route   GET /api/lectures
// @desc    Get teacher's lectures
// @access  Private (Teachers only)
router.get('/', authorizeRole('teacher'), getTeacherLectures);

// @route   GET /api/lectures/student
// @desc    Get student's lectures
// @access  Private (Students only)
router.get('/student', authorizeRole('student'), getStudentLectures);

// @route   GET /api/lectures/:id
// @desc    Get single lecture
// @access  Private
router.get('/:id', getLecture);

// @route   PUT /api/lectures/:id
// @desc    Update lecture
// @access  Private (Teachers only)
router.put('/:id', authorizeRole('teacher'), updateLecture);

// @route   DELETE /api/lectures/:id
// @desc    Delete lecture
// @access  Private (Teachers only)
router.delete('/:id', authorizeRole('teacher'), deleteLecture);

// @route   POST /api/lectures/:id/start-qr
// @desc    Start QR session for lecture
// @access  Private (Teachers only)
router.post('/:id/start-qr', authorizeRole('teacher'), startQRSession);

export default router;
