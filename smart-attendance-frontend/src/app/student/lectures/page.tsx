'use client';
import { useAuth } from '@/context/AuthContext';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { lectureApi } from '@/lib/api';
import { Lecture } from '@/types';

export default function StudentLecturesPage() {
  const { user } = useAuth();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchLectures();
  }, [selectedDate]);

  const fetchLectures = async () => {
    try {
      const response = await lectureApi.getStudentLectures({ 
        date: selectedDate,
        limit: 20 
      });
      setLectures(response.data.data.lectures);
    } catch (error) {
      console.error('Error fetching lectures:', error);
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
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Lectures</h1>
                <p className="mt-2 text-gray-600">
                  View your class schedule and upcoming lectures
                </p>
              </div>
              <Link href="/student/scan">
                <Button className="bg-green-600 hover:bg-green-700">
                  📱 Scan QR Code
                </Button>
              </Link>
            </div>
          </div>

          {/* Date Filter */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              >
                Today
              </Button>
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
                  <div className="text-4xl mb-4">📅</div>
                  <h3 className="text-lg font-medium mb-2">No lectures scheduled</h3>
                  <p>No lectures found for {new Date(selectedDate).toLocaleDateString()}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Lectures for {new Date(selectedDate).toLocaleDateString()}
                  </h3>
                  
                  {lectures.map((lecture) => (
                    <div key={lecture._id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">
                              {lecture.lectureName}
                            </h4>
                            <span className={`px-2 py-1 text-xs rounded ${
                              lecture.status === 'active' ? 'bg-green-100 text-green-800' :
                              lecture.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {lecture.status.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p><strong>Subject:</strong> {lecture.subject}</p>
                              <p><strong>Lecture #:</strong> {lecture.lectureNumber}</p>
                              <p><strong>Teacher:</strong> {lecture.teacherName}</p>
                            </div>
                            <div>
                              <p><strong>Time:</strong> {lecture.startTime} - {lecture.endTime}</p>
                              <p><strong>Class:</strong> {lecture.class} - {lecture.section}</p>
                              <p><strong>Date:</strong> {new Date(lecture.date).toLocaleDateString()}</p>
                            </div>
                          </div>

                          {lecture.qrSessionActive && (
                            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center">
                                <span className="text-green-600 mr-2">🟢</span>
                                <span className="text-sm text-green-800 font-medium">
                                  QR Session Active - You can mark attendance now!
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col space-y-2 ml-6">
                          {lecture.qrSessionActive && (
                            <Link href="/student/scan">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Scan QR Now
                              </Button>
                            </Link>
                          )}
                          
                          <Button variant="secondary" size="sm" disabled>
                            View Details
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
