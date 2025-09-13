'use client';
import { useAuth } from '@/context/AuthContext';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useState } from 'react';
import { lectureApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CreateLecturePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    lectureNumber: '',
    lectureName: '',
    subject: '',
    class: '',
    section: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    startTime: '',
    endTime: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await lectureApi.create(formData);
      if (response.data.success) {
        toast.success('✅ Lecture created successfully!');
        router.push('/teacher/lectures');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create lecture');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'teacher') {
    return <div>Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create New Lecture</h1>
                <p className="mt-2 text-gray-600">
                  Set up a new lecture session for attendance tracking
                </p>
              </div>
              <Link href="/teacher/lectures">
                <Button variant="secondary">
                  ← Back to Lectures
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Lecture Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lecture Number *
                    </label>
                    <input
                      type="text"
                      name="lectureNumber"
                      required
                      value={formData.lectureNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., L001, Lec-01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Data Structures, Machine Learning"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lecture Name *
                    </label>
                    <input
                      type="text"
                      name="lectureName"
                      required
                      value={formData.lectureName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Introduction to Binary Trees"
                    />
                  </div>
                </div>
              </div>

              {/* Class Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Class Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class *
                    </label>
                    <input
                      type="text"
                      name="class"
                      required
                      value={formData.class}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., CSE-4A, IT-3B"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section *
                    </label>
                    <input
                      type="text"
                      name="section"
                      required
                      value={formData.section}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., A, B, C"
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      required
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time *
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      required
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Teacher Info (Auto-filled) */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Teacher Information</h4>
                <div className="text-sm text-gray-600">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Department:</strong> {user.department}</p>
                  <p><strong>Employee ID:</strong> {user.employeeId}</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link href="/teacher/lectures">
                  <Button variant="secondary" disabled={isSubmitting}>
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Create Lecture
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
