"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, LayoutDashboard, Users, BookOpen, FileText, Settings, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 w-1/5">
            <Link
              href="/"
              className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-all duration-300 group"
            >
              <GraduationCap className="h-6 w-6 text-[#2563eb]" />
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:from-[#2563eb] group-hover:to-[#3B82F6] transition-all duration-300">
                ERP Portal
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center justify-center gap-4 w-3/5">
            <Link href="/">
              <Button
                variant="ghost"
                className="rounded-full hover:bg-[#2563eb]/10 hover:text-[#2563eb] transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Button>
            </Link>
            
            <Link href="/teachers/dashboard">
              <Button
                variant="ghost"
                className="rounded-full hover:bg-[#2563eb]/10 hover:text-[#2563eb] transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" /> Teachers
              </Button>
            </Link>
            <Link href="/students/dashboard">
              <Button
                variant="ghost"
                className="rounded-full hover:bg-[#2563eb]/10 hover:text-[#2563eb] transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Users className="h-4 w-4" /> Students
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="ghost"
                className="rounded-full hover:bg-[#2563eb]/10 hover:text-[#2563eb] transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <FileText className="h-4 w-4" /> About
              </Button>
            </Link>
          </div>

          {/* Right-side Profile Placeholder */}
          <div className="flex items-center justify-end w-1/5">
          <Link href="/auth/login">
            <Button
              variant="outline"
              className="rounded-full flex items-center gap-2 border-[#2563eb]/30 text-[#2563eb] hover:bg-gradient-to-r hover:from-[#2563eb] hover:to-[#3B82F6] hover:text-white hover:border-[#2563eb] transition-all duration-300 hover:scale-105"
            >
             
              Login
            </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden flex items-center p-2 ml-2 rounded-full hover:bg-[#2563eb]/10"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-[#2563eb]" />
              ) : (
                <Menu className="h-6 w-6 text-[#2563eb]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-background/95 border-t border-border"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="py-4 px-2 space-y-3"
              >
                <Link href="/dashboard" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-left rounded-full hover:bg-[#2563eb]/10 hover:text-[#2563eb] flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Button>
                </Link>
                <Link href="/students" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-left rounded-full hover:bg-[#2563eb]/10 hover:text-[#2563eb] flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" /> Students
                  </Button>
                </Link>
                <Link href="/teachers" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-left rounded-full hover:bg-[#2563eb]/10 hover:text-[#2563eb] flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" /> Teachers
                  </Button>
                </Link>
                <Link href="/about" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-left rounded-full hover:bg-[#2563eb]/10 hover:text-[#2563eb] flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" /> About
                  </Button>
                </Link>
                <Link href="/auth/login" className="block">
  <Button
    variant="outline"
    className="w-full rounded-full flex items-center justify-center gap-2 border-[#2563eb]/30 text-[#2563eb] hover:bg-gradient-to-r hover:from-[#2563eb] hover:to-[#3B82F6] hover:text-white"
  >
    <Settings className="h-4 w-4" /> Sign-In
  </Button>
</Link>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
