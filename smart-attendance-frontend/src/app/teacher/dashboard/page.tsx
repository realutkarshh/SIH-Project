"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Calendar,
  BarChart3,
  Plus,
  Bell,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { lectureApi } from "@/lib/api";
import { Lecture } from "@/types";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [recentLectures, setRecentLectures] = useState<Lecture[]>([]);
  const [stats, setStats] = useState({
    totalLectures: 0,
    activeLectures: 0,
    totalAttendance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const lecturesResponse = await lectureApi.getTeacherLectures({ limit: 5 });
      const lectures = lecturesResponse.data.data.lectures;

      setRecentLectures(lectures);

      const totalLectures = lecturesResponse.data.data.pagination.total;
      const activeLectures = lectures.filter(
        (l: Lecture) => l.status === "active"
      ).length;

      setStats({
        totalLectures,
        activeLectures,
        totalAttendance: 0, // TODO: integrate attendanceApi
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== "teacher") {
    return <div>Access denied</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-purple-600/20 text-purple-400 border border-purple-600/30";
      case "completed":
        return "bg-green-600/20 text-green-400 border border-green-600/30";
      default:
        return "bg-blue-600/20 text-blue-400 border border-blue-600/30";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back 👋 {user.name}</h1>
            <p className="text-gray-400">
              Manage your lectures and track student progress
            </p>
          </div>
          <Link href="/teacher/create-lecture">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" /> New Lecture
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-gray-400 text-sm">Total Lectures</span>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.totalLectures}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-gray-400 text-sm">Active Sessions</span>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.activeLectures}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-gray-400 text-sm">Department</span>
              </div>
            </div>
            <div className="text-2xl font-bold">{user.department}</div>
          </div>
        </div>

        {/* Quick Actions */}
        {/* <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/teacher/create-lecture">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                ➕ Create Lecture
              </Button>
            </Link>
            <Link href="/teacher/lectures">
              <Button variant="secondary" className="w-full">
                📋 View Lectures
              </Button>
            </Link>
            <Button variant="secondary" className="w-full" disabled>
              📊 Generate Report
            </Button>
            <Button variant="secondary" className="w-full" disabled>
              ⚙️ Settings
            </Button>
          </div>
        </div> */}

        {/* Lecture Reminders */}
        {/* <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Lecture Reminders</h3>
              <p className="text-gray-400 text-sm">
                Manage your schedule and notifications
              </p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-sm">
              <Plus className="w-4 h-4 mr-2" /> Add New
            </Button>
          </div>
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">You have no lecture reminders</p>
            <p className="text-gray-500 text-sm">Click "+ Add New" to create one</p>
          </div>
        </div> */}

        {/* Recent Lectures Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-lg font-semibold">Recent Lectures</span>
            </div>
            <Link
              href="/teacher/lectures"
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              View all
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-6 text-gray-400">Loading...</div>
          ) : recentLectures.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No lectures yet.{" "}
              <Link
                href="/teacher/create-lecture"
                className="text-purple-400 hover:text-purple-300"
              >
                Create your first lecture
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-800">
                  <tr>
                    <th className="text-left py-3 px-6 text-gray-400 font-medium text-sm">
                      Lecture
                    </th>
                    <th className="text-left py-3 px-6 text-gray-400 font-medium text-sm">
                      Status
                    </th>
                    <th className="text-left py-3 px-6 text-gray-400 font-medium text-sm">
                      Progress
                    </th>
                    <th className="text-left py-3 px-6 text-gray-400 font-medium text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentLectures.map((lecture) => (
                    <tr
                      key={lecture._id}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-white mb-1">
                            {lecture.subject}
                          </div>
                          <div className="text-sm text-gray-400">
                            {lecture.lectureName} • {lecture.class}-
                            {lecture.section}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            lecture.status
                          )}`}
                        >
                          {lecture.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-gray-800 rounded-full h-2 max-w-[100px]">
                            <div
                              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${lecture.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-400 min-w-[30px]">
                            {lecture.progress || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button className="text-gray-400 hover:text-gray-300 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
