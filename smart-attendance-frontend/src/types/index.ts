export interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  role: 'teacher' | 'student';
  department: string;
  class?: string;
  section?: string;
  profileImage?: string;
  createdAt: string;
}

export interface Lecture {
  _id: string;
  lectureNumber: string;
  lectureName: string;
  subject: string;
  class: string;
  section: string;
  department: string;
  teacherId: string;
  teacherName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  qrSessionActive: boolean;
  qrSessionStartTime?: string;
  qrSessionEndTime?: string;
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
}

export interface AttendanceRecord {
  _id: string;
  studentId: string;
  studentName: string;
  studentEmployeeId: string;
  lectureId: string;
  lectureName: string;
  class: string;
  section: string;
  teacherId: string;
  teacherName: string;
  status: 'present' | 'absent' | 'late';
  markedAt: string;
  markedBy: string;
}

export interface QRSession {
  sessionId: string;
  qrCodeDataURL: string;
  qrData: string;
  startTime: string;
  endTime: string;
  duration: number;
  refreshInterval: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
