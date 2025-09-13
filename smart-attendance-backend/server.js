import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import lectureRoutes from './routes/lecture.js';
import attendanceRoutes from './routes/attendance.js';
import qrRoutes from './routes/qr.js';



// Load environment variables
dotenv.config();

const app = express();

// ✅ Allow only your frontend
const allowedOrigins = ["https://smart-attendance-tau.vercel.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if you’re sending cookies/auth headers
  })
);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/qr', qrRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Smart Attendance System API',
    version: '1.0.0',
    status: 'Server running successfully!',
    database: 'Connected',
    endpoints: {
      auth: '/api/auth',
      lectures: '/api/lectures',
      attendance: '/api/attendance',
      qr: '/api/qr',
      available_routes: [
        // Auth routes
        'POST /api/auth/register',
        'POST /api/auth/login', 
        'GET /api/auth/profile',
        // Lecture routes
        'POST /api/lectures',
        'GET /api/lectures',
        'GET /api/lectures/student',
        'POST /api/lectures/:id/start-qr',
        // Attendance routes
        'POST /api/attendance/mark',
        'GET /api/attendance/student',
        'GET /api/attendance/lecture/:lectureId',
        'GET /api/attendance/report',
        // QR routes
        'POST /api/qr/refresh/:sessionId',
        'POST /api/qr/stop/:sessionId',
        'GET /api/qr/status/:sessionId'
      ]
    }
  });
});

// 404 handler - Simple middleware without wildcards
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (must be last)
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔐 Authentication routes available at /api/auth`);
  console.log(`🌐 API Documentation: http://localhost:${PORT}`);
});
