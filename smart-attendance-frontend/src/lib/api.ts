import axios from 'axios';
import { ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  register: (userData: any) => api.post('/api/auth/register', userData),
  login: (credentials: any) => api.post('/api/auth/login', credentials),
  getProfile: () => api.get('/api/auth/profile'),
};

// Lecture API
export const lectureApi = {
  create: (lectureData: any) => api.post('/api/lectures', lectureData),
  getTeacherLectures: (params?: any) => api.get('/api/lectures', { params }),
  getStudentLectures: (params?: any) => api.get('/api/lectures/student', { params }),
  getLecture: (id: string) => api.get(`/api/lectures/${id}`),
  startQR: (id: string) => api.post(`/api/lectures/${id}/start-qr`),
  update: (id: string, data: any) => api.put(`/api/lectures/${id}`, data),
  delete: (id: string) => api.delete(`/api/lectures/${id}`),
};

// Attendance API
export const attendanceApi = {
  mark: (qrData: string) => api.post('/api/attendance/mark', { qrData }),
  getStudentHistory: (params?: any) => api.get('/api/attendance/student', { params }),
  getLectureAttendance: (lectureId: string) => api.get(`/api/attendance/lecture/${lectureId}`),
  getReport: (params?: any) => api.get('/api/attendance/report', { params }),
};

// QR API
export const qrApi = {
  refresh: (sessionId: string) => api.post(`/api/qr/refresh/${sessionId}`),
  stop: (sessionId: string) => api.post(`/api/qr/stop/${sessionId}`),
  getStatus: (sessionId: string) => api.get(`/api/qr/status/${sessionId}`),
};
