'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { qrApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface QRDisplayProps {
  sessionId: string;
  initialData?: any;
}

export function QRDisplay({ sessionId, initialData }: QRDisplayProps) {
  const [qrData, setQrData] = useState(initialData);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [tokenTimeRemaining, setTokenTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let tokenInterval: NodeJS.Timeout;

    if (isActive) {
      // Refresh QR token every 6 seconds
      tokenInterval = setInterval(async () => {
        try {
          const response = await qrApi.refresh(sessionId);
          if (response.data.success) {
            setQrData(response.data.data);
          }
        } catch (error: any) {
          if (error.response?.status === 400) {
            setIsActive(false);
            toast.error('QR session expired');
          }
        }
      }, 6000);

      // Update countdown every second
      interval = setInterval(() => {
        if (qrData?.endTime) {
          const remaining = new Date(qrData.endTime).getTime() - Date.now();
          setTimeRemaining(Math.max(0, remaining));
          
          if (remaining <= 0) {
            setIsActive(false);
          }
        }

        if (qrData?.tokenGeneratedAt) {
          const tokenAge = Date.now() - new Date(qrData.tokenGeneratedAt).getTime();
          const tokenRemaining = Math.max(0, 6000 - tokenAge);
          setTokenTimeRemaining(tokenRemaining);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (tokenInterval) clearInterval(tokenInterval);
    };
  }, [sessionId, isActive, qrData]);

  const handleStopSession = async () => {
    try {
      await qrApi.stop(sessionId);
      setIsActive(false);
      toast.success('QR session stopped successfully');
      window.close();
    } catch (error: any) {
      toast.error('Failed to stop session');
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!qrData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            📚 Attendance QR Code
          </h1>
          <p className="text-gray-600">
            Students: Scan this QR code to mark your attendance
          </p>
        </div>

        {/* QR Code Display */}
        {isActive ? (
          <div className="mb-6">
            <div className="bg-white p-4 rounded-xl border-4 border-gray-200 inline-block">
              <img
                src={qrData.qrCodeDataURL}
                alt="Attendance QR Code"
                className="w-64 h-64 mx-auto"
              />
            </div>
            
            {/* Token Refresh Indicator */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(tokenTimeRemaining / 6000) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                QR refreshes every 6 seconds for security
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6 text-center">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-xl font-semibold text-red-600">Session Expired</h2>
            <p className="text-gray-600">This QR session has ended</p>
          </div>
        )}

        {/* Session Info */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Session Time:</span>
            <span className={`text-sm font-mono ${timeRemaining > 30000 ? 'text-green-600' : timeRemaining > 10000 ? 'text-yellow-600' : 'text-red-600'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <span className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-red-600'}`}>
              {isActive ? '🟢 ACTIVE' : '🔴 EXPIRED'}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Session ID:</span>
            <span className="text-sm font-mono text-gray-600">
              {sessionId.slice(0, 8)}...
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          {isActive && (
            <Button
              onClick={handleStopSession}
              // variant="danger"
              className="w-full"
            >
              🛑 Stop Session
            </Button>
          )}
          
          <Button
            onClick={() => window.close()}
            variant="secondary"
            className="w-full"
          >
            Close Window
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-left">
          <h4 className="font-medium text-gray-900 mb-2">📋 Instructions:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Keep this window open during class</li>
            <li>• Students scan with their mobile phones</li>
            <li>• QR code changes every 6 seconds</li>
            <li>• Session lasts for 1 minute</li>
          </ul>
        </div>
      </div>

      {/* Fullscreen Toggle */}
      <button
        onClick={() => document.documentElement.requestFullscreen()}
        className="mt-4 text-white text-sm opacity-70 hover:opacity-100"
      >
        📺 Click for fullscreen view
      </button>
    </div>
  );
}
