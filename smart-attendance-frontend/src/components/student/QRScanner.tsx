'use client';
import { useState, useEffect, useRef } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Button } from '@/components/ui/button';
import { attendanceApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface QRScannerProps {
  onSuccess?: (result: string) => void;
  onError?: (error: string) => void;
}

export function QRScanner({ onSuccess, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScan, setLastScan] = useState<string>('');
  const [scanHistory, setScanHistory] = useState<Array<{time: string, result: string}>>([]);

  // Prevent duplicate scans within 3 seconds
  const isDuplicateScan = (data: string) => {
    return lastScan === data && Date.now() - parseInt(localStorage.getItem('lastScanTime') || '0') < 3000;
  };

  const handleScan = async (result: any) => {
    if (!result || isProcessing) return;
    
    // Extract the actual QR code data
    const scannedData = result.text || result || '';
    
    if (!scannedData || isDuplicateScan(scannedData)) {
      return;
    }

    setIsProcessing(true);
    setLastScan(scannedData);
    localStorage.setItem('lastScanTime', Date.now().toString());

    try {
      // Validate QR data format
      let qrData;
      try {
        qrData = JSON.parse(scannedData);
      } catch {
        throw new Error('Invalid QR code format');
      }

      if (!qrData.sessionId || !qrData.lectureId || !qrData.token) {
        throw new Error('QR code missing required information');
      }

      // Mark attendance
      const response = await attendanceApi.mark(scannedData);
      
      if (response.data.success) {
        const { attendance, lecture } = response.data.data;
        
        // Add to scan history
        setScanHistory(prev => [{
          time: new Date().toLocaleTimeString(),
          result: `✅ ${lecture.lectureName}`
        }, ...prev.slice(0, 4)]);

        toast.success(`✅ Attendance marked successfully!\n${response.data.message}`, {
          duration: 4000,
          icon: '✅'
        });
        
        onSuccess?.(scannedData);
        
        // Stop scanning after successful scan
        setIsScanning(false);
      } else {
        throw new Error(response.data.message || 'Failed to mark attendance');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Scan failed';
      
      setScanHistory(prev => [{
        time: new Date().toLocaleTimeString(),
        result: `❌ ${errorMessage}`
      }, ...prev.slice(0, 4)]);

      toast.error(`❌ ${errorMessage}`, {
        duration: 4000,
        icon: '❌'
      });
      
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (error: any) => {
    console.error('QR Scanner Error:', error);
    toast.error('Camera access failed. Please allow camera permissions.');
  };

  return (
    <div className="space-y-6">
      {/* Scanner Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">QR Code Scanner</h3>
          <Button
            onClick={() => setIsScanning(!isScanning)}
            // variant={isScanning ? 'danger' : 'primary'}
            disabled={isProcessing}
          >
            {isScanning ? '📹 Stop Scanner' : '📱 Start Scanner'}
          </Button>
        </div>

        {/* Scanner Interface */}
        {isScanning && (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '300px' }}>
              {/* Fixed Scanner Component */}
              <Scanner
                onScan={handleScan}
                onError={handleError}
                paused={isProcessing}
                allowMultiple={false}
                scanDelay={1000}
                styles={{
                  container: { 
                    width: '100%', 
                    height: '300px',
                    position: 'relative'
                  }
                }}
              />
              
              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="border-2 border-white border-dashed rounded-lg p-8">
                  <div className="text-white text-center">
                    <div className="animate-pulse text-2xl">📱</div>
                    <div className="mt-2 text-sm">Position QR code in frame</div>
                  </div>
                </div>
              </div>

              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                  <div className="bg-white p-4 rounded-lg text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <div className="text-sm text-gray-600">Processing...</div>
                  </div>
                </div>
              )}
            </div>

            {/* Scanner Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">📋 Instructions:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Point your camera at the QR code displayed by your teacher</li>
                <li>• Make sure the QR code is clearly visible and within the frame</li>
                <li>• Hold steady until the scan completes</li>
                <li>• You'll see a confirmation message when attendance is marked</li>
              </ul>
            </div>
          </div>
        )}

        {/* Camera Permission Help */}
        {!isScanning && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">📷</div>
            <p>Click "Start Scanner" to open your camera and scan QR codes</p>
            <p className="text-sm mt-2">
              Make sure to allow camera permissions when prompted
            </p>
          </div>
        )}
      </div>

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="font-medium text-gray-900 mb-4">Recent Scans</h4>
          <div className="space-y-2">
            {scanHistory.map((scan, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">{scan.result}</span>
                <span className="text-xs text-gray-500">{scan.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Entry (Fallback) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ManualQREntry />
      </div>
    </div>
  );
}

// Manual QR Entry Component (Fallback if camera doesn't work)
function ManualQREntry() {
  const [qrText, setQrText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await attendanceApi.mark(qrText);
      toast.success('✅ Attendance marked successfully!');
      setQrText('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h4 className="font-medium text-gray-900 mb-4">Manual Entry (If camera doesn't work)</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste QR Code Data:
          </label>
          <textarea
            value={qrText}
            onChange={(e) => setQrText(e.target.value)}
            placeholder="Paste the QR code data here..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <Button
          type="submit"
          disabled={!qrText.trim() || isSubmitting}
          // isLoading={isSubmitting}
        >
          Mark Attendance
        </Button>
      </form>
    </div>
  );
}
