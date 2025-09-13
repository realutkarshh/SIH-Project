import { Lecture, User, QRSession } from '../models/index.js';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

// @desc    Create new lecture
// @route   POST /api/lectures
// @access  Private (Teachers only)
export const createLecture = async (req, res) => {
  try {
    const {
      lectureNumber,
      lectureName,
      subject,
      class: lectureClass,
      section,
      date,
      startTime,
      endTime
    } = req.body;

    // Validate teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Only teachers can create lectures'
      });
    }

    // Check for duplicate lecture
    const existingLecture = await Lecture.findOne({
      teacherId: req.user._id,
      lectureNumber,
      class: lectureClass,
      section,
      date: new Date(date).toDateString()
    });

    if (existingLecture) {
      return res.status(400).json({
        success: false,
        message: 'Lecture with this number already exists for this class and date'
      });
    }

    // Create lecture
    const lecture = await Lecture.create({
      lectureNumber,
      lectureName,
      subject,
      class: lectureClass,
      section,
      department: req.user.department,
      teacherId: req.user._id,
      teacherName: req.user.name,
      date: new Date(date),
      startTime,
      endTime,
      status: 'scheduled'
    });

    res.status(201).json({
      success: true,
      message: 'Lecture created successfully',
      data: {
        lecture
      }
    });

  } catch (error) {
    console.error('Create lecture error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating lecture',
      error: error.message
    });
  }
};

// @desc    Get all lectures for teacher
// @route   GET /api/lectures
// @access  Private (Teachers)
export const getTeacherLectures = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, class: filterClass } = req.query;

    // Build filter
    let filter = { teacherId: req.user._id };
    if (status) filter.status = status;
    if (filterClass) filter.class = filterClass;

    // Get lectures with pagination
    const lectures = await Lecture.find(filter)
      .sort({ date: -1, startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Lecture.countDocuments(filter);

    res.json({
      success: true,
      data: {
        lectures,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get lectures error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lectures'
    });
  }
};

// @desc    Get student's lectures
// @route   GET /api/lectures/student
// @access  Private (Students)
export const getStudentLectures = async (req, res) => {
  try {
    const { page = 1, limit = 10, date } = req.query;

    // Build filter for student's class and section
    let filter = {
      class: req.user.class,
      section: req.user.section
    };

    if (date) {
      filter.date = {
        $gte: new Date(date),
        $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
      };
    }

    const lectures = await Lecture.find(filter)
      .sort({ date: -1, startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Lecture.countDocuments(filter);

    res.json({
      success: true,
      data: {
        lectures,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get student lectures error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lectures'
    });
  }
};

// @desc    Get single lecture
// @route   GET /api/lectures/:id
// @access  Private
export const getLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    // Check permission
    if (req.user.role === 'teacher' && lecture.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (req.user.role === 'student' && (lecture.class !== req.user.class || lecture.section !== req.user.section)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { lecture }
    });

  } catch (error) {
    console.error('Get lecture error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lecture'
    });
  }
};

// @desc    Update lecture
// @route   PUT /api/lectures/:id
// @access  Private (Teachers only)
export const updateLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    // Check if teacher owns this lecture
    if (lecture.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Cannot update active or completed lectures
    if (lecture.status === 'active' || lecture.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update active or completed lectures'
      });
    }

    const updatedLecture = await Lecture.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Lecture updated successfully',
      data: { lecture: updatedLecture }
    });

  } catch (error) {
    console.error('Update lecture error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating lecture'
    });
  }
};

// @desc    Delete lecture
// @route   DELETE /api/lectures/:id
// @access  Private (Teachers only)
export const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    // Check if teacher owns this lecture
    if (lecture.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Cannot delete active lectures
    if (lecture.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active lectures'
      });
    }

    await Lecture.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Lecture deleted successfully'
    });

  } catch (error) {
    console.error('Delete lecture error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting lecture'
    });
  }
};

// @desc    Start QR session for lecture
// @route   POST /api/lectures/:id/start-qr
// @access  Private (Teachers only)
export const startQRSession = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    // Check if teacher owns this lecture
    if (lecture.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if QR session is already active
    if (lecture.qrSessionActive) {
      return res.status(400).json({
        success: false,
        message: 'QR session is already active'
      });
    }

    // Create QR session
    const sessionId = uuidv4();
    const currentToken = uuidv4();
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 60000); // 1 minute duration

    // QR Data contains session info
    const qrData = JSON.stringify({
      sessionId,
      lectureId: lecture._id,
      teacherId: req.user._id,
      token: currentToken,
      timestamp: startTime.getTime()
    });

    // Generate QR Code
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 256
    });

    // Create QR session in database
    const qrSession = await QRSession.create({
      sessionId,
      lectureId: lecture._id,
      qrData,
      startTime,
      endTime,
      currentToken,
      tokenGeneratedAt: startTime,
      isActive: true
    });

    // Update lecture
    await Lecture.findByIdAndUpdate(req.params.id, {
      status: 'active',
      qrSessionActive: true,
      qrSessionStartTime: startTime,
      qrSessionEndTime: endTime
    });

    res.json({
      success: true,
      message: 'QR session started successfully',
      data: {
        sessionId,
        qrCodeDataURL,
        qrData,
        startTime,
        endTime,
        duration: 60000, // 1 minute in milliseconds
        refreshInterval: 6000 // 6 seconds in milliseconds
      }
    });

  } catch (error) {
    console.error('Start QR session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting QR session'
    });
  }
};
