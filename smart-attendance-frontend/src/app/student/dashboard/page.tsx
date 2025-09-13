'use client';
import { useAuth } from '@/context/AuthContext';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { lectureApi, attendanceApi } from '@/lib/api';
import { Lecture, AttendanceRecord } from '@/types';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [todayLectures, setTodayLectures] = useState<Lecture[]>([]);
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState({
    totalLectures: 0,
    attendedLectures: 0,
    attendancePercentage: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch today's lectures
      const today = new Date().toISOString().split('T')[0];
      const lecturesResponse = await lectureApi.getStudentLectures({ date: today });
      setTodayLectures(lecturesResponse.data.data.lectures);

      // Fetch recent attendance
      const attendanceResponse = await attendanceApi.getStudentHistory({ limit: 5 });
      setRecentAttendance(attendanceResponse.data.data.attendance);
      
      // Set stats from attendance response
      if (attendanceResponse.data.data.statistics) {
        const { totalClasses, presentClasses, attendancePercentage } = attendanceResponse.data.data.statistics;
        setStats({
          totalLectures: totalClasses,
          attendedLectures: presentClasses,
          attendancePercentage
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== 'student') {
    return <div>Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back, {user.name}! Track your attendance and scan QR codes.
            </p>
            <div className="mt-2 text-sm text-gray-500">
              {user.class} - Section {user.section} • {user.department}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">📚</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Lectures
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {isLoading ? '...' : stats.totalLectures}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">✅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Attended
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {isLoading ? '...' : stats.attendedLectures}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                      stats.attendancePercentage >= 80 ? 'bg-green-500' : 
                      stats.attendancePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      <span className="text-white font-bold">%</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Attendance Rate
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {isLoading ? '...' : `${stats.attendancePercentage}%`}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/student/scan">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    📱 Scan QR Code
                  </Button>
                </Link>
                <Link href="/student/lectures">
                  <Button variant="secondary" className="w-full">
                    📋 My Lectures
                  </Button>
                </Link>
                <Link href="/student/history">
                  <Button variant="secondary" className="w-full">
                    📊 Attendance History
                  </Button>
                </Link>
                <Button variant="secondary" className="w-full" disabled>
                  ⚙️ Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Today's Lectures */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Today's Lectures</h3>
                <span className="text-sm text-gray-500">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : todayLectures.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No lectures scheduled for today! 🎉
                </div>
              ) : (
                <div className="space-y-4">
                  {todayLectures.map((lecture) => (
                    <div key={lecture._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{lecture.lectureName}</h4>
                          <p className="text-sm text-gray-600">
                            {lecture.subject} • Prof. {lecture.teacherName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {lecture.startTime} - {lecture.endTime}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            lecture.status === 'active' ? 'bg-green-100 text-green-800' :
                            lecture.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {lecture.status.toUpperCase()}
                          </span>
                          {lecture.qrSessionActive && (
                            <Link href="/student/scan">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Scan Now
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Attendance */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Recent Attendance</h3>
                <Link href="/student/history" className="text-blue-600 hover:text-blue-500 text-sm">
                  View all
                </Link>
              </div>
              
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : recentAttendance.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No attendance records yet. Start scanning QR codes!
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAttendance.map((record) => (
                    <div key={record._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{record.lectureName}</h4>
                        <p className="text-sm text-gray-600">Marked by {record.teacherName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(record.markedAt).toLocaleDateString()} • {new Date(record.markedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        record.status === 'present' ? 'bg-green-100 text-green-800' :
                        record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
