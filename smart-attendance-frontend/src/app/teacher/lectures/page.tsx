'use client';
import { useAuth } from '@/context/AuthContext';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { lectureApi, qrApi } from '@/lib/api';
import { Lecture } from '@/types';
import toast from 'react-hot-toast';

export default function TeacherLecturesPage() {
  const { user } = useAuth();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingLectureId, setProcessingLectureId] = useState<string | null>(null);

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const response = await lectureApi.getTeacherLectures({ limit: 20 });
      setLectures(response.data.data.lectures);
    } catch (error) {
      console.error('Error fetching lectures:', error);
      toast.error('Failed to fetch lectures');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQR = async (lectureId: string) => {
    setProcessingLectureId(lectureId);
    try {
      const response = await lectureApi.startQR(lectureId);
      if (response.data.success) {
        toast.success('QR session started successfully!');
        // Redirect to QR display page
        window.open(`/teacher/qr-session/${response.data.data.sessionId}`, '_blank');
        fetchLectures(); // Refresh to update status
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to start QR session');
    } finally {
      setProcessingLectureId(null);
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Lectures</h1>
                <p className="mt-2 text-gray-600">
                  Manage your lectures and start QR attendance sessions
                </p>
              </div>
              <Link href="/teacher/create-lecture">
                <Button>
                  ➕ Create New Lecture
                </Button>
              </Link>
            </div>
          </div>

          {/* Lectures List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <div className="mt-2 text-gray-600">Loading lectures...</div>
                </div>
              ) : lectures.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="text-lg font-medium mb-2">No lectures created yet</h3>
                  <p className="mb-4">Create your first lecture to start taking attendance</p>
                  <Link href="/teacher/create-lecture">
                    <Button>Create First Lecture</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    All Lectures ({lectures.length})
                  </h3>
                  
                  {lectures.map((lecture) => (
                    <div key={lecture._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h4 className="text-lg font-medium text-gray-900">
                              {lecture.lectureName}
                            </h4>
                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                              lecture.status === 'active' ? 'bg-green-100 text-green-800' :
                              lecture.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                              lecture.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {lecture.status.toUpperCase()}
                            </span>
                            {lecture.qrSessionActive && (
                              <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full font-medium animate-pulse">
                                🔴 QR LIVE
                              </span>
                            )}
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                            <div>
                              <p><strong>Subject:</strong> {lecture.subject}</p>
                              <p><strong>Lecture #:</strong> {lecture.lectureNumber}</p>
                            </div>
                            <div>
                              <p><strong>Class:</strong> {lecture.class} - {lecture.section}</p>
                              <p><strong>Date:</strong> {new Date(lecture.date).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p><strong>Time:</strong> {lecture.startTime} - {lecture.endTime}</p>
                              <p><strong>Attendance:</strong> {lecture.presentStudents}/{lecture.totalStudents}</p>
                            </div>
                          </div>

                          {lecture.qrSessionActive && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="text-green-600 mr-2 animate-pulse">🟢</span>
                                  <span className="text-sm text-green-800 font-medium">
                                    QR Session Active - Students can scan now!
                                  </span>
                                </div>
                                <div className="text-xs text-green-600">
                                  Expires: {lecture.qrSessionEndTime && new Date(lecture.qrSessionEndTime).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col space-y-2 ml-6 min-w-[140px]">
                          {lecture.status === 'scheduled' && !lecture.qrSessionActive && (
                            <Button
                              size="sm"
                              onClick={() => handleStartQR(lecture._id)}
                              disabled={processingLectureId === lecture._id}
                              isLoading={processingLectureId === lecture._id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              🚀 Start QR Session
                            </Button>
                          )}
                          
                          {lecture.qrSessionActive && (
                            <Button
                              size="sm"
                              onClick={() => window.open(`/teacher/qr-session/${lecture._id}`, '_blank')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              📺 View QR Display
                            </Button>
                          )}
                          
                          <Link href={`/teacher/attendance/${lecture._id}`}>
                            <Button variant="secondary" size="sm" className="w-full">
                              📊 View Attendance
                            </Button>
                          </Link>
                          
                          <Button variant="secondary" size="sm" disabled>
                            ⚙️ Settings
                          </Button>
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
