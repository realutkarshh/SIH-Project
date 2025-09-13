import { Attendance, Lecture, User, QRSession } from '../models/index.js';
import { validateQRScan } from '../utils/qrGenerator.js';

// @desc    Mark attendance by scanning QR code
// @route   POST /api/attendance/mark
// @access  Private (Students only)
export const markAttendance = async (req, res) => {
  try {
    const { qrData } = req.body;
    const studentId = req.user._id;

    // Validate user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can mark attendance'
      });
    }

    // Validate QR code
    const validation = await validateQRScan(qrData, studentId);
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const session = validation.session;

    // Get lecture details
    const lecture = await Lecture.findById(session.lectureId);
    
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    // Check if student belongs to this class/section
    if (lecture.class !== req.user.class || lecture.section !== req.user.section) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this class/section'
      });
    }

    // Check if attendance already exists
    const existingAttendance = await Attendance.findOne({
      studentId: studentId,
      lectureId: lecture._id
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this lecture'
      });
    }

    // Create attendance record
    const attendanceRecord = await Attendance.create({
      studentId: req.user._id,
      studentName: req.user.name,
      studentEmployeeId: req.user.employeeId,
      lectureId: lecture._id,
      lectureName: lecture.lectureName,
      class: lecture.class,
      section: lecture.section,
      teacherId: lecture.teacherId,
      teacherName: lecture.teacherName,
      status: 'present',
      markedAt: new Date(),
      markedBy: 'QR_SCAN',
      qrSessionId: session.sessionId,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    // Update QR session - mark as scanned by this student
    await QRSession.findByIdAndUpdate(session._id, {
      $push: {
        scannedBy: {
          studentId: req.user._id,
          scannedAt: new Date()
        }
      }
    });

    // Update lecture attendance count
    await Lecture.findByIdAndUpdate(lecture._id, {
      $inc: { presentStudents: 1 }
    });

    res.json({
      success: true,
      message: `Attendance marked successfully! Marked by ${lecture.teacherName}`,
      data: {
        attendance: attendanceRecord,
        lecture: {
          lectureName: lecture.lectureName,
          subject: lecture.subject,
          teacherName: lecture.teacherName,
          date: lecture.date,
          startTime: lecture.startTime
        }
      }
    });

  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking attendance',
      error: error.message
    });
  }
};

// @desc    Get student's attendance history
// @route   GET /api/attendance/student/:studentId?
// @access  Private
export const getStudentAttendance = async (req, res) => {
  try {
    let targetStudentId;

    // If studentId provided in params (for teachers/admin)
    if (req.params.studentId) {
      if (req.user.role !== 'teacher') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Only teachers can view other students attendance'
        });
      }
      targetStudentId = req.params.studentId;
    } else {
      // Students can only see their own attendance
      if (req.user.role !== 'student') {
        return res.status(403).json({
          success: false,
          message: 'Student ID required for non-student users'
        });
      }
      targetStudentId = req.user._id;
    }

    const { page = 1, limit = 10, startDate, endDate, subject } = req.query;

    // Build filter
    let filter = { studentId: targetStudentId };
    
    if (startDate && endDate) {
      filter.markedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get attendance records with pagination
    const attendanceQuery = Attendance.find(filter)
      .populate('lectureId', 'subject date startTime endTime')
      .sort({ markedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    if (subject) {
      attendanceQuery.populate({
        path: 'lectureId',
        match: { subject: new RegExp(subject, 'i') }
      });
    }

    const attendance = await attendanceQuery;
    const total = await Attendance.countDocuments(filter);

    // Filter out records where lecture doesn't match subject filter
    const filteredAttendance = attendance.filter(record => record.lectureId);

    // Calculate attendance statistics
    const stats = await Attendance.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalClasses: { $sum: 1 },
          presentClasses: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
          },
          lateClasses: {
            $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] }
          }
        }
      }
    ]);

    const statistics = stats || { totalClasses: 0, presentClasses: 0, lateClasses: 0 };
    const attendancePercentage = statistics.totalClasses > 0 
      ? Math.round((statistics.presentClasses / statistics.totalClasses) * 100) 
      : 0;

    res.json({
      success: true,
      data: {
        attendance: filteredAttendance,
        statistics: {
          ...statistics,
          attendancePercentage,
          absentClasses: statistics.totalClasses - statistics.presentClasses - statistics.lateClasses
        },
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total: filteredAttendance.length
        }
      }
    });

  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance records'
    });
  }
};

// @desc    Get attendance for a specific lecture
// @route   GET /api/attendance/lecture/:lectureId
// @access  Private (Teachers only)
export const getLectureAttendance = async (req, res) => {
  try {
    const { lectureId } = req.params;

    // Get lecture details
    const lecture = await Lecture.findById(lectureId);
    
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    // Check if teacher owns this lecture
    if (req.user.role === 'teacher' && lecture.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get all students in this class/section
    const classStudents = await User.find({
      role: 'student',
      class: lecture.class,
      section: lecture.section,
      isActive: true
    }).select('name employeeId email');

    // Get attendance records for this lecture
    const attendanceRecords = await Attendance.find({ lectureId })
      .populate('studentId', 'name employeeId email');

    // Create attendance map
    const attendanceMap = {};
    attendanceRecords.forEach(record => {
      attendanceMap[record.studentId._id.toString()] = record;
    });

    // Build complete attendance list
    const completeAttendance = classStudents.map(student => {
      const attendance = attendanceMap[student._id.toString()];
      return {
        student: {
          id: student._id,
          name: student.name,
          employeeId: student.employeeId,
          email: student.email
        },
        status: attendance ? attendance.status : 'absent',
        markedAt: attendance ? attendance.markedAt : null,
        markedBy: attendance ? attendance.markedBy : null
      };
    });

    // Calculate statistics
    const presentCount = completeAttendance.filter(a => a.status === 'present').length;
    const absentCount = completeAttendance.filter(a => a.status === 'absent').length;
    const lateCount = completeAttendance.filter(a => a.status === 'late').length;
    const totalStudents = completeAttendance.length;

    res.json({
      success: true,
      data: {
        lecture: {
          id: lecture._id,
          lectureName: lecture.lectureName,
          subject: lecture.subject,
          class: lecture.class,
          section: lecture.section,
          date: lecture.date,
          startTime: lecture.startTime,
          endTime: lecture.endTime
        },
        attendance: completeAttendance,
        statistics: {
          totalStudents,
          presentCount,
          absentCount,
          lateCount,
          attendancePercentage: totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0
        }
      }
    });

  } catch (error) {
    console.error('Get lecture attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lecture attendance'
    });
  }
};

// @desc    Get attendance report for teacher's classes
// @route   GET /api/attendance/report
// @access  Private (Teachers only)
export const getAttendanceReport = async (req, res) => {
  try {
    const { startDate, endDate, class: filterClass, section: filterSection, subject } = req.query;

    // Build filter for teacher's lectures
    let lectureFilter = { teacherId: req.user._id };
    
    if (startDate && endDate) {
      lectureFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (filterClass) lectureFilter.class = filterClass;
    if (filterSection) lectureFilter.section = filterSection;
    if (subject) lectureFilter.subject = new RegExp(subject, 'i');

    // Get teacher's lectures
    const lectures = await Lecture.find(lectureFilter).select('_id lectureName subject class section date');
    const lectureIds = lectures.map(l => l._id);

    if (lectureIds.length === 0) {
      return res.json({
        success: true,
        data: {
          report: [],
          summary: {
            totalLectures: 0,
            totalStudents: 0,
            averageAttendance: 0
          }
        }
      });
    }

    // Get attendance data
    const attendanceData = await Attendance.aggregate([
      { $match: { lectureId: { $in: lectureIds } } },
      {
        $group: {
          _id: '$lectureId',
          totalPresent: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
          totalLate: { $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] } },
          totalAttendance: { $sum: 1 }
        }
      }
    ]);

    // Create report
    const report = lectures.map(lecture => {
      const attendance = attendanceData.find(a => a._id.toString() === lecture._id.toString()) || 
        { totalPresent: 0, totalLate: 0, totalAttendance: 0 };
      
      return {
        lecture: {
          id: lecture._id,
          name: lecture.lectureName,
          subject: lecture.subject,
          class: lecture.class,
          section: lecture.section,
          date: lecture.date
        },
        attendance: {
          present: attendance.totalPresent,
          late: attendance.totalLate,
          absent: 0, // Will be calculated based on class size
          total: attendance.totalAttendance,
          percentage: attendance.totalAttendance > 0 ? 
            Math.round((attendance.totalPresent / attendance.totalAttendance) * 100) : 0
        }
      };
    });

    // Calculate summary
    const summary = {
      totalLectures: lectures.length,
      totalStudents: attendanceData.reduce((sum, a) => sum + a.totalAttendance, 0),
      averageAttendance: attendanceData.length > 0 ?
        Math.round(attendanceData.reduce((sum, a) => 
          sum + (a.totalPresent / (a.totalAttendance || 1) * 100), 0) / attendanceData.length) : 0
    };

    res.json({
      success: true,
      data: {
        report,
        summary
      }
    });

  } catch (error) {
    console.error('Get attendance report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating attendance report'
    });
  }
};

// @desc    Get dynamic QR code (refreshes every 6 seconds)
// @route   GET /api/attendance/qr/:sessionId
// @access  Private (Students only)
export const getLatestQR = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await QRSession.findOne({ sessionId, isActive: true });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'QR session not found or expired'
      });
    }

    // Check if session has expired
    if (new Date() > session.endTime) {
      await QRSession.findByIdAndUpdate(session._id, { isActive: false });
      return res.status(410).json({
        success: false,
        message: 'QR session has expired'
      });
    }

    // Return current QR data
    res.json({
      success: true,
      data: {
        sessionId: session.sessionId,
        qrData: session.qrData,
        token: session.currentToken,
        tokenGeneratedAt: session.tokenGeneratedAt,
        expiresAt: session.endTime,
        remainingTime: session.endTime - new Date()
      }
    });

  } catch (error) {
    console.error('Get latest QR error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching QR code'
    });
  }
};
