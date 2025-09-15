import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import lectureRoutes from './routes/lecture.js';
import attendanceRoutes from './routes/attendance.js';
import qrRoutes from './routes/qr.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// ✅ Allowed origins (local + deployed frontend)
const allowedOrigins = [
  // "http://localhost:3000",              // local Next.js dev
  // "http://127.0.0.1:3000",             // sometimes needed
  "https://smart-attendance-tau.vercel.app" // deployed frontend
];

// ✅ CORS middleware (only once!)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("❌ CORS blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies/auth headers
  })
);

// ✅ Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Connect DB
connectDB();

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/qr', qrRoutes);

// ✅ Basic route
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
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server Error:', error.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔐 Authentication routes available at /api/auth`);
  console.log(`🌐 API Documentation: http://localhost:${PORT}`);
});
