'use client';
import { useAuth } from '@/context/AuthContext';
import { Navigation } from '@/components/layout/Navigation';
// Choose one of these imports based on which one works better
import { QRScanner } from '@/components/student/QRScanner'; // Fixed Yudiel version
// import { Html5QRScanner as QRScanner } from '@/components/student/Html5QRScanner'; // Alternative version
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function ScanPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user || user.role !== 'student') {
    return <div>Access denied</div>;
  }

  const handleScanSuccess = (result: string) => {
    setTimeout(() => {
      router.push('/student/dashboard');
    }, 3000);
  };

  const handleScanError = (error: string) => {
    console.error('Scan error:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Scan QR Code</h1>
                <p className="mt-2 text-gray-600">
                  Scan the QR code displayed by your teacher to mark attendance
                </p>
              </div>
              <Link href="/student/dashboard">
                <Button variant="secondary">
                  ← Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-blue-600 text-xl">👨‍🎓</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  {user.name} ({user.employeeId})
                </h3>
                <p className="text-sm text-blue-600">
                  {user.class} - Section {user.section} • {user.department}
                </p>
              </div>
            </div>
          </div>

          <QRScanner 
            onSuccess={handleScanSuccess}
            onError={handleScanError}
          />
        </div>
      </div>
    </div>
  );
}
