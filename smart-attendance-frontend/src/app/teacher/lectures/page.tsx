"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { lectureApi } from "@/lib/api";
import { Lecture } from "@/types";

import {
  BookOpen,
  Users,
  Target,
  Calendar,
  Clock,
  Play,
  Eye,
  BarChart3,
  Settings,
  Plus,
} from "lucide-react";

export default function TeacherLecturesPage() {
  const { user } = useAuth();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingLectureId, setProcessingLectureId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const response = await lectureApi.getTeacherLectures({ limit: 20 });
      setLectures(response.data.data.lectures);
    } catch (error) {
      console.error("Error fetching lectures:", error);
      toast.error("Failed to fetch lectures");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQR = async (lectureId: string) => {
    setProcessingLectureId(lectureId);
    try {
      const response = await lectureApi.startQR(lectureId);
      if (response.data.success) {
        toast.success("QR session started!");
        window.open(`/teacher/qr-session/${response.data.data.sessionId}`, "_blank");
        fetchLectures();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to start QR session");
    } finally {
      setProcessingLectureId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "completed":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const getProgressPercentage = (present: number, total: number) => {
    return total > 0 ? Math.round((present / total) * 100) : 0;
  };

  if (!user || user.role !== "teacher") {
    return <div className="text-center text-red-400 py-20">Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Navigation />

      {/* Header */}
      {/* <div className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                My Lectures
              </h1>
              <p className="text-sm text-gray-400">
                Manage your lectures and attendance sessions
              </p>
            </div>
          </div>
          <Link href="/teacher/create-lecture">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Lecture</span>
            </Button>
          </Link>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
            <p className="text-gray-400 text-sm">Total Lectures</p>
            <p className="text-2xl font-bold text-white mt-1">{lectures.length}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-emerald-500/50 transition-all">
            <p className="text-gray-400 text-sm">Active Sessions</p>
            <p className="text-2xl font-bold text-white mt-1">
              {lectures.filter((l) => l.qrSessionActive).length}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
            <p className="text-gray-400 text-sm">Avg Attendance</p>
            <p className="text-2xl font-bold text-white mt-1">
              {lectures.length > 0
                ? Math.round(
                    lectures.reduce(
                      (acc, l) =>
                        acc + getProgressPercentage(l.presentStudents, l.totalStudents),
                      0
                    ) / lectures.length
                  )
                : 0}
              %
            </p>
          </div>
        </div>

        {/* Lectures List */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">
              All Lectures ({lectures.length})
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="date">Sort by Date</option>
              <option value="status">Sort by Status</option>
              <option value="attendance">Sort by Attendance</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-400">Loading lectures...</span>
            </div>
          ) : lectures.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                No lectures created yet
              </h3>
              <p className="text-gray-400 mb-6">
                Create your first lecture to start taking attendance
              </p>
              <Link href="/teacher/create-lecture">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500">
                  Create First Lecture
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-700/30">
              {lectures.map((lecture, index) => (
                <div
                  key={lecture._id}
                  className="p-6 hover:bg-gray-700/20 transition-all group"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <div className="flex items-start justify-between">
                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <h4 className="text-lg font-semibold group-hover:text-purple-300 transition-colors">
                          {lecture.lectureName}
                        </h4>
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium border ${getStatusColor(
                            lecture.status
                          )}`}
                        >
                          {lecture.status.toUpperCase()}
                        </span>
                        {lecture.qrSessionActive && (
                          <span className="px-3 py-1 text-xs bg-orange-500/20 text-orange-400 rounded-full font-medium border border-orange-500/30 animate-pulse flex items-center space-x-1">
                            🔴 <span>QR LIVE</span>
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-gray-400">📘 {lecture.subject}</p>
                          <p className="text-gray-500 text-xs">
                            Lecture #{lecture.lectureNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">
                            🎯 {lecture.class} - {lecture.section}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {new Date(lecture.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">
                            ⏰ {lecture.startTime} - {lecture.endTime}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">
                            👥 {lecture.presentStudents}/{lecture.totalStudents}
                          </p>
                          <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${getProgressPercentage(
                                  lecture.presentStudents,
                                  lecture.totalStudents
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {lecture.qrSessionActive && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-emerald-400 font-medium">
                              🟢 QR Session Active - Students can scan now!
                            </span>
                            {lecture.qrSessionEndTime && (
                              <span className="text-xs text-emerald-400/70">
                                Expires:{" "}
                                {new Date(
                                  lecture.qrSessionEndTime
                                ).toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-6">
                      {lecture.status === "scheduled" && !lecture.qrSessionActive && (
                        <Button
                          size="sm"
                          onClick={() => handleStartQR(lecture._id)}
                          disabled={processingLectureId === lecture._id}
                          className="bg-emerald-600 hover:bg-emerald-500"
                        >
                          {processingLectureId === lecture._id ? "Starting..." : "🚀 Start QR"}
                        </Button>
                      )}

                      {lecture.qrSessionActive && (
                        <Button
                          size="sm"
                          onClick={() =>
                            window.open(`/teacher/qr-session/${lecture._id}`, "_blank")
                          }
                          className="bg-blue-600 hover:bg-blue-500"
                        >
                          📺 View QR
                        </Button>
                      )}

                      <Link href={`/teacher/attendance/${lecture._id}`}>
                        <Button size="sm" variant="secondary" className="w-full">
                          📊 Attendance
                        </Button>
                      </Link>

                      <Button size="sm" variant="secondary" disabled className="cursor-not-allowed">
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

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
