"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";

export function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isTeacher = user.role === "teacher";
  const isStudent = user.role === "student";

  const teacherLinks = [
    { href: "/teacher/dashboard", label: "Dashboard" },
    { href: "/teacher/lectures", label: "Lectures" },
    { href: "/teacher/create-lecture", label: "Create Lecture" },
  ];

  const studentLinks = [
    { href: "/student/dashboard", label: "Dashboard" },
    { href: "/student/lectures", label: "My Lectures" },
    { href: "/student/scan", label: "Scan QR" },
    { href: "/student/history", label: "Attendance History" },
  ];

  const links = isTeacher ? teacherLinks : studentLinks;

  return (
    <nav className="border-b border-gray-800 bg-[#0f0f1a] text-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left side - Logo + Links */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Smart Attendance</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition ${
                  pathname === link.href
                    ? "text-purple-400 border-b-2 border-purple-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side - User info + Logout */}
        <div className="flex items-center gap-4">
          {/* <div className="text-sm text-gray-300">
            Welcome, <span className="font-medium text-white">{user.name}</span>
            <span className="ml-2 px-2 py-1 text-xs bg-purple-900 text-purple-200 rounded">
              {user.role.toUpperCase()}
            </span>
          </div> */}

          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            className="bg-purple-600 hover:bg-purple-700 text-black"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-gray-800 bg-[#141421]">
        <div className="px-4 py-3 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                pathname === link.href
                  ? "text-purple-400 bg-purple-900"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
