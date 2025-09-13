'use client';
import { useAuth } from '@/context/AuthContext';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { attendanceApi, lectureApi } from '@/lib/api';
import { Lecture } from '@/types';
import toast from 'react-hot-toast';

interface AttendanceRecord {
  student: {
    id: string;
    name: string;
    employeeId: string;
    email: string;
  };
  status: 'present' | 'absent' | 'late';
  markedAt: string | null;
  markedBy: string | null;
}

interface AttendanceData {
  lecture: {
    id: string;
    lectureName: string;
    subject: string;
    class: string;
    section: string;
    date: string;
    startTime: string;
    endTime: string;
  };
  attendance: AttendanceRecord[];
  statistics: {
    totalStudents: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    attendancePercentage: number;
  };
}

export default function LectureAttendancePage() {
  const { user } = useAuth();
  const params = useParams();
  const lectureId = params.lectureId as string;
  
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'present' | 'absent' | 'late'>('all');

  useEffect(() => {
    fetchAttendanceData();
  }, [lectureId]);

  const fetchAttendanceData = async () => {
    try {
      // Fetch lecture details and attendance data
      const [lectureResponse, attendanceResponse] = await Promise.all([
        lectureApi.getLecture(lectureId),
        attendanceApi.getLectureAttendance(lectureId)
      ]);

      setLecture(lectureResponse.data.data.lecture);
      setAttendanceData(attendanceResponse.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch attendance data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAttendance = attendanceData?.attendance.filter(record => {
    if (filter === 'all') return true;
    return record.status === filter;
  }) || [];

  const exportToCSV = () => {
    if (!attendanceData) return;

    const headers = ['Name', 'Employee ID', 'Email', 'Status', 'Marked At'];
    const rows = attendanceData.attendance.map(record => [
      record.student.name,
      record.student.employeeId,
      record.student.email,
      record.status.toUpperCase(),
      record.markedAt ? new Date(record.markedAt).toLocaleString() : 'Not marked'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${attendanceData.lecture.lectureName}-attendance.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!user || user.role !== 'teacher') {
    return <div>Access denied</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading attendance data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!attendanceData || !lecture) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-900">Lecture not found</h2>
            <p className="text-gray-600 mt-2">The requested lecture could not be found.</p>
            <Link href="/teacher/lectures" className="mt-4 inline-block">
              <Button>← Back to Lectures</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Lecture Attendance</h1>
                <p className="mt-2 text-gray-600">
                  View and manage attendance for this lecture session
                </p>
              </div>
              <Link href="/teacher/lectures">
                <Button variant="secondary">
                  ← Back to Lectures
                </Button>
              </Link>
            </div>
          </div>

          {/* Lecture Info Card */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {attendanceData.lecture.lectureName}
                </h2>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  lecture.status === 'active' ? 'bg-green-100 text-green-800' :
                  lecture.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {lecture.status.toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Subject</p>
                  <p className="text-gray-600">{attendanceData.lecture.subject}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Class & Section</p>
                  <p className="text-gray-600">{attendanceData.lecture.class} - {attendanceData.lecture.section}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Date</p>
                  <p className="text-gray-600">{new Date(attendanceData.lecture.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Time</p>
                  <p className="text-gray-600">{attendanceData.lecture.startTime} - {attendanceData.lecture.endTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-blue-600">{attendanceData.statistics.totalStudents}</div>
              <div className="text-gray-600">Total Students</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-green-600">{attendanceData.statistics.presentCount}</div>
              <div className="text-gray-600">Present</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-red-600">{attendanceData.statistics.absentCount}</div>
              <div className="text-gray-600">Absent</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-purple-600">{attendanceData.statistics.attendancePercentage}%</div>
              <div className="text-gray-600">Attendance Rate</div>
            </div>
          </div>

          {/* Controls and Filters */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex space-x-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status:</label>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Students ({attendanceData.statistics.totalStudents})</option>
                      <option value="present">Present ({attendanceData.statistics.presentCount})</option>
                      <option value="absent">Absent ({attendanceData.statistics.absentCount})</option>
                      <option value="late">Late ({attendanceData.statistics.lateCount})</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={exportToCSV}
                    variant="secondary"
                  >
                    📊 Export CSV
                  </Button>
                  <Button
                    onClick={() => window.print()}
                    variant="secondary"
                  >
                    🖨️ Print
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Student Attendance ({filteredAttendance.length} students)
              </h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Marked At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAttendance.map((record, index) => (
                      <tr key={record.student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {record.student.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{record.student.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{record.student.employeeId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{record.student.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            record.status === 'present' ? 'bg-green-100 text-green-800' :
                            record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {record.status === 'present' && '✅'} 
                            {record.status === 'late' && '⚠️'} 
                            {record.status === 'absent' && '❌'} 
                            {record.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {record.markedAt ? (
                            <div className="text-sm text-gray-900">
                              <div>{new Date(record.markedAt).toLocaleDateString()}</div>
                              <div className="text-xs text-gray-500">{new Date(record.markedAt).toLocaleTimeString()}</div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Not marked</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredAttendance.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p>No students found with "{filter}" status</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
