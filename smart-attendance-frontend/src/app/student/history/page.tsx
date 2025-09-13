'use client';
import { useAuth } from '@/context/AuthContext';
import { Navigation } from '@/components/layout/Navigation';
import { useEffect, useState } from 'react';
import { attendanceApi } from '@/lib/api';
import { AttendanceRecord } from '@/types';

export default function AttendanceHistoryPage() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  const fetchAttendanceHistory = async () => {
    try {
      const response = await attendanceApi.getStudentHistory({ limit: 50 });
      setAttendance(response.data.data.attendance);
      setStats(response.data.data.statistics);
    } catch (error) {
      console.error('Error fetching attendance:', error);
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
            <h1 className="text-3xl font-bold text-gray-900">Attendance History</h1>
            <p className="mt-2 text-gray-600">
              View your complete attendance record and statistics
            </p>
          </div>

          {/* Stats Overview */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-2xl font-bold text-blue-600">{stats.totalClasses || 0}</div>
                <div className="text-gray-600">Total Classes</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600">{stats.presentClasses || 0}</div>
                <div className="text-gray-600">Present</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-2xl font-bold text-red-600">{stats.absentClasses || 0}</div>
                <div className="text-gray-600">Absent</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-2xl font-bold text-purple-600">{stats.attendancePercentage || 0}%</div>
                <div className="text-gray-600">Attendance Rate</div>
              </div>
            </div>
          )}

          {/* Attendance Records */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance Records</h3>
              
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : attendance.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No attendance records found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lecture
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Teacher
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendance.map((record) => (
                        <tr key={record._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{record.lectureName}</div>
                            <div className="text-sm text-gray-500">{record.class}-{record.section}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{record.teacherName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(record.markedAt).toLocaleDateString()}</div>
                            <div className="text-sm text-gray-500">{new Date(record.markedAt).toLocaleTimeString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              record.status === 'present' ? 'bg-green-100 text-green-800' :
                              record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {record.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
