'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'teacher') {
        router.push('/teacher/dashboard');
      } else if (user.role === 'student') {
        router.push('/student/dashboard');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Smart Attendance System
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Modern QR code-based attendance tracking for educational institutions. 
            Secure, fast, and reliable attendance management.
          </p>

          <div className="max-w-md mx-auto space-y-4">
            <Link href="/auth/login">
              <Button size="lg" className="w-full">
                Login to System
              </Button>
            </Link>
            
            <div className="text-center text-gray-500">
              Don't have an account?
            </div>
            
            <Link href="/auth/register">
              <Button variant="secondary" size="lg" className="w-full">
                Register New Account
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">For Teachers</h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Create and manage lectures</li>
                <li>• Generate dynamic QR codes</li>
                <li>• Track student attendance</li>
                <li>• Generate detailed reports</li>
                <li>• Real-time attendance monitoring</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4 text-green-600">For Students</h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Scan QR codes to mark attendance</li>
                <li>• View lecture schedules</li>
                <li>• Track attendance history</li>
                <li>• Get attendance statistics</li>
                <li>• Mobile-friendly interface</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
