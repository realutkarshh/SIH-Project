'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { QRDisplay } from '@/components/teacher/QRDisplay';
import { qrApi } from '@/lib/api';

export default function QRSessionPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSessionData();
  }, [sessionId]);

  const fetchSessionData = async () => {
    try {
      const response = await qrApi.getStatus(sessionId);
      if (response.data.success) {
        setSessionData(response.data.data);
      } else {
        setError('Session not found');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load session');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading QR session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-xl font-bold mb-2">Session Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return <QRDisplay sessionId={sessionId} initialData={sessionData} />;
}
