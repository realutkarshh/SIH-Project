'use client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isTeacher = user.role === 'teacher';
  const isStudent = user.role === 'student';

  const teacherLinks = [
    { href: '/teacher/dashboard', label: 'Dashboard' },
    { href: '/teacher/lectures', label: 'Lectures' },
    { href: '/teacher/create-lecture', label: 'Create Lecture' },
  ];

  const studentLinks = [
    { href: '/student/dashboard', label: 'Dashboard' },
    { href: '/student/lectures', label: 'My Lectures' },
    { href: '/student/scan', label: 'Scan QR' },
    { href: '/student/history', label: 'Attendance History' },
  ];

  const links = isTeacher ? teacherLinks : studentLinks;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Smart Attendance
            </Link>
            
            <div className="hidden md:flex ml-10 space-x-8">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium ${
                    pathname === link.href
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Welcome, <span className="font-medium">{user.name}</span>
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                {user.role.toUpperCase()}
              </span>
            </div>
            
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 text-base font-medium ${
                  pathname === link.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
