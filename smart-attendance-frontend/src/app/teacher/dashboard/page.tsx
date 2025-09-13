'use client';
import { useAuth } from '@/context/AuthContext';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { lectureApi, attendanceApi } from '@/lib/api';
import { Lecture } from '@/types';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [recentLectures, setRecentLectures] = useState<Lecture[]>([]);
  const [stats, setStats] = useState({
    totalLectures: 0,
    activeLectures: 0,
    totalAttendance: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch recent lectures
      const lecturesResponse = await lectureApi.getTeacherLectures({ limit: 5 });
      setRecentLectures(lecturesResponse.data.data.lectures);

      // Calculate stats
      const totalLectures = lecturesResponse.data.data.pagination.total;
      const activeLectures = lecturesResponse.data.data.lectures.filter(
        (l: Lecture) => l.status === 'active'
      ).length;

      setStats({
        totalLectures,
        activeLectures,
        totalAttendance: 0 // You can calculate this from attendance API
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== 'teacher') {
    return <div>Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back, {user.name}! Manage your lectures and track attendance.
            </p>
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
                      <span className="text-white font-bold">🟢</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Sessions
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {isLoading ? '...' : stats.activeLectures}
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
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Department
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user.department}
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
                <Link href="/teacher/create-lecture">
                  <Button className="w-full">
                    ➕ Create New Lecture
                  </Button>
                </Link>
                <Link href="/teacher/lectures">
                  <Button variant="secondary" className="w-full">
                    📋 View All Lectures
                  </Button>
                </Link>
                <Button variant="secondary" className="w-full" disabled>
                  📊 Generate Report
                </Button>
                <Button variant="secondary" className="w-full" disabled>
                  ⚙️ Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Lectures */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Recent Lectures</h3>
                <Link href="/teacher/lectures" className="text-blue-600 hover:text-blue-500 text-sm">
                  View all
                </Link>
              </div>
              
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : recentLectures.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No lectures yet. <Link href="/teacher/create-lecture" className="text-blue-600">Create your first lecture</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentLectures.map((lecture) => (
                    <div key={lecture._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{lecture.lectureName}</h4>
                          <p className="text-sm text-gray-600">
                            {lecture.subject} • {lecture.class}-{lecture.section}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(lecture.date).toLocaleDateString()} • {lecture.startTime}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            lecture.status === 'active' ? 'bg-green-100 text-green-800' :
                            lecture.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {lecture.status.toUpperCase()}
                          </span>
                          {lecture.status === 'scheduled' && (
                            <Button size="sm" onClick={() => {}}>
                              Start QR
                            </Button>
                          )}
                        </div>
                      </div>
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
