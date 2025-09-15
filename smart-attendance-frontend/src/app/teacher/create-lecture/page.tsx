'use client';
import { useAuth } from '@/context/AuthContext';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { lectureApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, BookOpen, Calendar, Clock, Users, User, Building } from 'lucide-react';

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
    return (
      <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center">
        <div className="text-center text-red-400 p-10">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] text-gray-100">
      <Navigation />
      
      {/* Header */}
      {/* <div className="bg-[#141526] backdrop-blur-xl border-b border-[#2a2b45] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Create New Lecture
                </h1>
                <p className="text-sm text-gray-400">
                  Set up a new lecture session for attendance tracking
                </p>
              </div>
            </div>
            <Link href="/teacher/lectures">
              <Button className="bg-[#1e1f36] hover:bg-[#262845] text-gray-300 border border-[#2a2b45] flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Lectures</span>
              </Button>
            </Link>
          </div>
        </div>
      </div> */}

      <div className="max-w-6xl mx-auto py-8 px-6">
        <div className="bg-[#1e1f36] border border-[#2a2b45] shadow-xl rounded-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Lecture Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Lecture Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="lectureNumber"
                    required
                    value={formData.lectureNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#141526] border border-[#2a2b45] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-gray-100 placeholder-gray-500 transition-all duration-200"
                    placeholder="e.g., L001, Lec-01"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#141526] border border-[#2a2b45] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-gray-100 placeholder-gray-500 transition-all duration-200"
                    placeholder="e.g., Data Structures, Machine Learning"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Lecture Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="lectureName"
                    required
                    value={formData.lectureName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#141526] border border-[#2a2b45] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-gray-100 placeholder-gray-500 transition-all duration-200"
                    placeholder="e.g., Introduction to Binary Trees"
                  />
                </div>
              </div>
            </div>

            {/* Class Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Class Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Year <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="class"
                    required
                    value={formData.class}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#141526] border border-[#2a2b45] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-gray-100 placeholder-gray-500 transition-all duration-200"
                    placeholder="e.g., CSE-4A, IT-3B"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Section <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="section"
                    required
                    value={formData.section}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#141526] border border-[#2a2b45] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-gray-100 placeholder-gray-500 transition-all duration-200"
                    placeholder="e.g., A, B, C"
                  />
                </div>
              </div>
            </div>

            {/* Schedule Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Schedule</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#141526] border border-[#2a2b45] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-gray-100 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Start Time <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    required
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#141526] border border-[#2a2b45] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-gray-100 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    End Time <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    required
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#141526] border border-[#2a2b45] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-gray-100 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Teacher Info (Auto-filled) */}
            <div className="bg-[#141526] border border-[#2a2b45] rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-orange-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">Teacher Information</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-300">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400">Name:</span>
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400">Department:</span>
                  <span className="font-medium">{user?.department}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <span className="text-gray-400">Employee ID:</span>
                  <span className="font-medium">{user?.employeeId}</span>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-[#2a2b45]">
              <Link href="/teacher/lectures">
                <Button 
                  type="button"
                  disabled={isSubmitting}
                  className="bg-[#141526] hover:bg-[#1a1b30] text-gray-300 border border-[#2a2b45] px-6 py-3 rounded-xl transition-all duration-200"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span>Create Lecture</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}